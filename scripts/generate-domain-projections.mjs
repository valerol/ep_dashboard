#!/usr/bin/env node

import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import yaml from "js-yaml";

const root = process.cwd();
const cycleDir = path.join(root, "data/ep-domain/observation/cycles");
const eventDir = path.join(root, "data/ep-domain/observation/events");
const indexPath = path.join(root, "data/ep-domain/observation/indexes/cycles.yaml");
const mapPath = path.join(root, "data/ep-domain/repository-map.yaml");
const projectionPath = path.join(root, "data/site-projection.json");
const checkOnly = process.argv.includes("--check");

async function yamlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const child = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await yamlFiles(child));
    if (entry.isFile() && entry.name.endsWith(".yaml")) files.push(child);
  }
  return files.sort();
}

async function loadYamlFiles(files) {
  return Promise.all(files.map(async (file) => {
    const document = yaml.load(await readFile(file, "utf8"));
    if (!document || typeof document !== "object") throw new Error(`${file}: expected a YAML object`);
    return document;
  }));
}

function latestTimestamp(records) {
  return records.map((record) => record.updated_at || record.created_at).filter(Boolean).sort().at(-1);
}

function replaceInventory(source, cycles, events) {
  const start = source.indexOf("current_inventory:\n");
  const end = source.indexOf("\nreconstruction:\n", start);
  if (start < 0 || end < 0) throw new Error("repository-map.yaml: current_inventory section not found");
  const protocols = yaml.load(source).current_inventory.active_protocol_versions;
  const block = yaml.dump({ current_inventory: {
    cycle_records: cycles.map((item) => item.cycle_instance_id),
    observation_events: events.map((item) => item.observation_event_id),
    active_protocol_versions: protocols,
    derived_indexes: ["data/ep-domain/observation/indexes/cycles.yaml"],
  } }, { lineWidth: -1, noRefs: true }).trimEnd();
  return `${source.slice(0, start)}${block}${source.slice(end)}`;
}

function publicCycle(record, typeTitles, cycleEvents) {
  const latestEvent = cycleEvents.at(-1);
  return {
    id: record.cycle_instance_id,
    type: record.cycle_type_id,
    title: typeTitles.get(record.cycle_type_id) || record.goal,
    goal: record.goal,
    cls: record.cycle_class,
    occurrence: record.occurrence,
    state: record.cycle_record_state,
    decision: record.transition_decision,
    outcome: record.current_closure_outcome,
    parent: record.parent_cycle_instance_id,
    result: record.actual_result || latestEvent?.state_change?.result || record.goal,
    step: record.current_step,
    plan: record.plan || [],
    evidencePolicy: record.evidence_policy || "REQUIRED",
    evidence: [...new Set([...(record.evidence_refs || []), ...cycleEvents.map((event) => event.observation_event_id)])],
    schedule: record.schedule || null,
    experiment: record.experiment || null,
    updatedAt: record.updated_at,
  };
}

function publicEvent(record) {
  const cycle = record.membership?.primary?.cycle_instance_id || "UNASSIGNED";
  const result = record.state_change?.result || record.action_or_event_ref;
  const occurredAt = record.occurred_at || record.observed_or_received_at || record.created_at;
  return {
    id: record.observation_event_id,
    date: occurredAt.slice(0, 10).split("-").reverse().join("."),
    occurredAt,
    type: record.event_type,
    title: result,
    detail: result,
    cycle,
    evidence: record.action_or_event_ref,
    facts: record.facts || null,
  };
}

async function expectedFiles() {
  const cycleFiles = await yamlFiles(cycleDir);
  const eventFiles = await yamlFiles(eventDir);
  const [cycles, events, typeRegistry, currentStep, news, sourceRegistry, mapSource] = await Promise.all([
    loadYamlFiles(cycleFiles),
    loadYamlFiles(eventFiles),
    readFile(path.join(root, "data/ep-domain/observation/cycle-types/registry.yaml"), "utf8").then(yaml.load),
    readFile(path.join(root, "data/current-step.json"), "utf8").then(JSON.parse),
    readFile(path.join(root, "data/news.json"), "utf8").then(JSON.parse),
    readFile(path.join(root, "data/source-registry.json"), "utf8").then(JSON.parse),
    readFile(mapPath, "utf8"),
  ]);
  cycles.sort((a, b) => a.cycle_instance_id.localeCompare(b.cycle_instance_id));
  events.sort((a, b) => a.observation_event_id.localeCompare(b.observation_event_id));

  const generatedAt = latestTimestamp([...cycles, ...events]);
  const index = {
    record_id: "EP-CYCLE-INDEX",
    record_type: "DERIVED_CYCLE_INDEX",
    schema_version: "1.0",
    created_at: yaml.load(await readFile(indexPath, "utf8")).created_at,
    updated_at: generatedAt,
    data_owner: "OWNER_LPR",
    source_refs: ["EP-DP-DR-009"],
    authority: "DERIVED_NON_CANONICAL_PROJECTION",
    generated_from: "data/ep-domain/observation/cycles/*.yaml",
    generated_at: generatedAt,
    counts: {
      total: cycles.length,
      open: cycles.filter((item) => item.cycle_record_state === "OPEN").length,
      closed: cycles.filter((item) => item.cycle_record_state === "CLOSED").length,
    },
    cycles: cycles.map((item) => ({
      cycle_instance_id: item.cycle_instance_id,
      cycle_type_id: item.cycle_type_id,
      cycle_class: item.cycle_class,
      occurrence: item.occurrence,
      parent_cycle_instance_id: item.parent_cycle_instance_id,
      cycle_record_state: item.cycle_record_state,
      current_closure_outcome: item.current_closure_outcome,
      subject_ref: item.scope?.instance_subject_ref,
    })),
  };

  const eventsByCycle = new Map();
  for (const event of events) {
    const cycleId = event.membership?.primary?.cycle_instance_id;
    if (!eventsByCycle.has(cycleId)) eventsByCycle.set(cycleId, []);
    eventsByCycle.get(cycleId).push(event);
  }
  const typeTitles = new Map(typeRegistry.cycle_types.map((item) => [item.cycle_type_id, item.title]));
  const publicCycles = cycles.map((item) => publicCycle(item, typeTitles, eventsByCycle.get(item.cycle_instance_id) || []))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt) || b.id.localeCompare(a.id));
  const publicEvents = events.map(publicEvent).sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
  const currentCycle = publicCycles.find((item) => item.state === "OPEN" && item.schedule?.date) || publicCycles.find((item) => item.state === "OPEN");
  const projection = {
    generatedAt,
    dataDate: generatedAt.slice(0, 10),
    counts: index.counts,
    currentCycle,
    cycles: publicCycles,
    events: publicEvents,
    currentStep,
    news,
    sourceRegistry,
  };

  return new Map([
    [indexPath, yaml.dump(index, { lineWidth: -1, noRefs: true })],
    [mapPath, replaceInventory(mapSource, cycles, events)],
    [projectionPath, `${JSON.stringify(projection, null, 2)}\n`],
  ]);
}

const outputs = await expectedFiles();
const stale = [];
for (const [file, expected] of outputs) {
  const existing = await readFile(file, "utf8").catch(() => "");
  if (existing === expected) continue;
  if (checkOnly) stale.push(path.relative(root, file));
  else await writeFile(file, expected);
}

if (stale.length) {
  console.error(`Derived projections are stale: ${stale.join(", ")}`);
  console.error("Run npm run generate:domain-projections and commit the results.");
  process.exitCode = 1;
} else {
  console.log(checkOnly ? "PASS: derived projections are current." : "Generated domain inventory, cycle index and site projection.");
}
