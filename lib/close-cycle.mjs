import yaml from "js-yaml";

export const ALLOWED_OUTCOMES = new Set(["ACHIEVED", "PARTIAL", "FAILED", "CANCELLED"]);
const CYCLES_ROOT = "data/ep-domain/observation/cycles";
const EVENTS_ROOT = "data/ep-domain/observation/events";
const INDEX_PATH = "data/ep-domain/observation/indexes/cycles.yaml";
const MAP_PATH = "data/ep-domain/repository-map.yaml";

export function validateClosureInput(input) {
  const cycleId = String(input?.cycleId || "").trim();
  const outcome = String(input?.outcome || "").trim();
  const comment = String(input?.comment || "").trim();
  if (!/^EP-[A-Z]+-\d{8}-\d{3}$/.test(cycleId)) throw new Error("INVALID_CYCLE_ID");
  if (!ALLOWED_OUTCOMES.has(outcome)) throw new Error("INVALID_OUTCOME");
  if (comment.length < 3 || comment.length > 1000) throw new Error("INVALID_COMMENT");
  return { cycleId, outcome, comment };
}

function headers(token) {
  return { accept: "application/vnd.github+json", authorization: `Bearer ${token}`, "content-type": "application/json", "x-github-api-version": "2022-11-28" };
}

async function github(fetcher, token, path, options = {}) {
  const response = await fetcher(`https://api.github.com${path}`, { ...options, headers: { ...headers(token), ...options.headers } });
  if (!response.ok) {
    const error = new Error(`GITHUB_${response.status}`);
    error.status = response.status;
    error.detail = (await response.text()).slice(0, 500);
    throw error;
  }
  return response.status === 204 ? null : response.json();
}

function decode(file) { return Buffer.from(file.content.replace(/\n/g, ""), "base64").toString("utf8"); }
function at(now) { return now.toISOString().replace("Z", "+00:00"); }
function unique(list, value) { return [...new Set([...(Array.isArray(list) ? list : []), value])]; }
function dump(value) { return yaml.dump(value, { lineWidth: 120, noRefs: true, sortKeys: false, quotingType: '"' }); }

function eventDate(now) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Vladivostok", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now).filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));
  return { year: parts.year, month: parts.month, compact: `${parts.year}${parts.month}${parts.day}` };
}

function nextEventId(names, compact) {
  const prefix = `EP-EVENT-${compact}-`;
  const highest = names.map((name) => name.replace(/\.yaml$/, "")).filter((name) => name.startsWith(prefix)).map((name) => Number(name.slice(prefix.length))).filter(Number.isInteger).reduce((max, value) => Math.max(max, value), 0);
  return `${prefix}${String(highest + 1).padStart(3, "0")}`;
}

async function readCycles({ owner, repo, branch, token, fetcher }) {
  const prefix = `/repos/${owner}/${repo}`;
  const files = await github(fetcher, token, `${prefix}/contents/${CYCLES_ROOT}?ref=${branch}`);
  return Promise.all(files.filter((file) => file.name?.endsWith(".yaml")).map((file) => github(fetcher, token, `${prefix}/contents/${file.path}?ref=${branch}`).then((item) => yaml.load(decode(item)))));
}

export async function listClosableCyclesInGitHub({ owner, repo, branch = "main", token, fetcher = fetch }) {
  const cycles = await readCycles({ owner, repo, branch, token, fetcher });
  return cycles.filter((cycle) => cycle.cycle_record_state === "OPEN" && cycle.evidence_policy === "NOT_REQUIRED" && !cycles.some((child) => child.parent_cycle_instance_id === cycle.cycle_instance_id && child.cycle_record_state !== "CLOSED")).map((cycle) => ({
    id: cycle.cycle_instance_id,
    type: cycle.cycle_type_id,
    title: cycle.goal || cycle.cycle_type_id,
    parent: cycle.parent_cycle_instance_id || null,
    evidencePolicy: cycle.evidence_policy,
  }));
}

function makeEvent({ eventId, cycle, outcome, comment, now, actor }) {
  const timestamp = at(now);
  return {
    record_id: eventId, record_type: "OBSERVATION_EVENT", schema_version: "1.0", created_at: timestamp, updated_at: timestamp, data_owner: "OWNER_LPR",
    source_refs: [`OWNER_LPR_WEB_CONFIRMATION:${timestamp}`], observation_event_id: eventId, event_type: "CYCLE_CLOSED", action_or_event_ref: `WEBSITE_CLOSE:${cycle.cycle_instance_id}`,
    occurred_at: timestamp, observed_or_received_at: timestamp,
    membership: { primary: { cycle_class: cycle.cycle_class, cycle_instance_id: cycle.cycle_instance_id, classification_basis_ref: "EP-DP-DR-006" }, related: cycle.parent_cycle_instance_id ? [{ cycle_instance_id: cycle.parent_cycle_instance_id }] : [], classified_by: "OWNER_LPR", classified_at: timestamp, decision_ref: "EP-DP-DR-007" },
    state_change: { previous_cycle_record_state: "OPEN", new_cycle_record_state: "CLOSED", current_step_after: "CYCLE_CLOSED", result: comment },
    closure: { outcome, expected_result_ref: cycle.expected_result || null, actual_result_or_NO_FINAL_RESULT: comment, actual_vs_expected_comparison: outcome, closure_basis: "OPERATOR_CONFIRMATION_EVIDENCE_NOT_REQUIRED", closure_evidence_refs: [], residue_disposition: outcome === "ACHIEVED" ? "NONE" : "RECORDED_IN_RESULT", decided_by: "OWNER_LPR", authority_ref: "WEBSITE_CLOSE_POLICY_NOT_REQUIRED", decided_at: timestamp, closed_at: timestamp },
    operator: { method: "CHATGPT_SIWC", actor },
    recording_sla: { oper_id: "O4", sla_class: "ORDINARY_OBSERVATION", classification_resolution_state: "FINAL", classification_basis_ref: "EP-DP-DR-007", sla_started_at: timestamp, sla_deadline_at: timestamp, evaluated_at: timestamp, actual_recorded_at: timestamp, recording_sla_status: "MET", late_flag: false, sla_rule_ref: "EP-DP-DR-008" },
  };
}

export async function closeCycleInGitHub({ owner, repo, branch = "main", token, input, actor, fetcher = fetch, now = new Date() }) {
  const { cycleId, outcome, comment } = validateClosureInput(input);
  const prefix = `/repos/${owner}/${repo}`;
  const [ref, cycleFile, cycleFiles, indexFile, mapFile] = await Promise.all([
    github(fetcher, token, `${prefix}/git/ref/heads/${branch}`),
    github(fetcher, token, `${prefix}/contents/${CYCLES_ROOT}/${cycleId}.yaml?ref=${branch}`),
    github(fetcher, token, `${prefix}/contents/${CYCLES_ROOT}?ref=${branch}`),
    github(fetcher, token, `${prefix}/contents/${INDEX_PATH}?ref=${branch}`),
    github(fetcher, token, `${prefix}/contents/${MAP_PATH}?ref=${branch}`),
  ]);
  const cycle = yaml.load(decode(cycleFile));
  if (cycle.cycle_record_state !== "OPEN") throw new Error("CYCLE_NOT_OPEN");
  if (cycle.evidence_policy !== "NOT_REQUIRED") throw new Error("EVIDENCE_REQUIRED");
  const children = await Promise.all(cycleFiles.filter((file) => file.name?.endsWith(".yaml") && file.name !== `${cycleId}.yaml`).map((file) => github(fetcher, token, `${prefix}/contents/${file.path}?ref=${branch}`).then((item) => yaml.load(decode(item)))));
  if (children.some((child) => child.parent_cycle_instance_id === cycleId && child.cycle_record_state !== "CLOSED")) throw new Error("OPEN_CHILD_CYCLES");

  const date = eventDate(now);
  let names = [];
  try { names = (await github(fetcher, token, `${prefix}/contents/${EVENTS_ROOT}/${date.year}/${date.month}?ref=${branch}`)).map((file) => file.name); }
  catch (error) { if (error.status !== 404) throw error; }
  const eventId = nextEventId(names, date.compact);
  const timestamp = at(now);
  const closedCycle = { ...cycle, updated_at: timestamp, source_refs: unique(cycle.source_refs, eventId), cycle_record_state: "CLOSED", transition_decision: "COMPLETE", current_step: "CYCLE_CLOSED", actual_result: comment, current_closed_at: timestamp, current_closure_outcome: outcome, current_closure_event_ref: eventId, closure_event_refs: unique(cycle.closure_event_refs, eventId) };
  const index = yaml.load(decode(indexFile));
  const indexEntry = index.cycles?.find((item) => item.cycle_instance_id === cycleId);
  if (!indexEntry) throw new Error("CYCLE_MISSING_FROM_INDEX");
  if (indexEntry.cycle_record_state !== "OPEN") throw new Error("INDEX_STATE_CONFLICT");
  indexEntry.cycle_record_state = "CLOSED"; indexEntry.current_closure_outcome = outcome; index.updated_at = timestamp; index.generated_at = timestamp; index.counts.open -= 1; index.counts.closed += 1;
  const map = yaml.load(decode(mapFile)); map.snapshot_at = timestamp.slice(0, 10); map.current_inventory.observation_events = unique(map.current_inventory.observation_events, eventId);
  const files = [[`${CYCLES_ROOT}/${cycleId}.yaml`, dump(closedCycle)], [`${EVENTS_ROOT}/${date.year}/${date.month}/${eventId}.yaml`, dump(makeEvent({ eventId, cycle, outcome, comment, now, actor }))], [INDEX_PATH, dump(index)], [MAP_PATH, dump(map)]];
  const blobs = await Promise.all(files.map(async ([path, content]) => ({ path, mode: "100644", type: "blob", sha: (await github(fetcher, token, `${prefix}/git/blobs`, { method: "POST", body: JSON.stringify({ content, encoding: "utf-8" }) })).sha })));
  const baseCommit = await github(fetcher, token, `${prefix}/git/commits/${ref.object.sha}`);
  const tree = await github(fetcher, token, `${prefix}/git/trees`, { method: "POST", body: JSON.stringify({ base_tree: baseCommit.tree.sha, tree: blobs }) });
  const commit = await github(fetcher, token, `${prefix}/git/commits`, { method: "POST", body: JSON.stringify({ message: `Close cycle ${cycleId}`, tree: tree.sha, parents: [ref.object.sha] }) });
  await github(fetcher, token, `${prefix}/git/refs/heads/${branch}`, { method: "PATCH", body: JSON.stringify({ sha: commit.sha, force: false }) });
  return { cycleId, eventId, outcome, commitSha: commit.sha, commitUrl: `https://github.com/${owner}/${repo}/commit/${commit.sha}` };
}
