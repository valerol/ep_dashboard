#!/usr/bin/env node

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DOMAIN_ROOT = "data/ep-domain";

function cleanScalar(value) {
  return value.trim().replace(/^['"]|['"]$/g, "");
}

function section(text, name) {
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex((line) => line === `${name}:`);
  if (start < 0) throw new Error(`repository-map.yaml: missing ${name}`);
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i += 1) {
    if (/^[A-Za-z_][A-Za-z0-9_]*:$/.test(lines[i])) {
      end = i;
      break;
    }
  }
  return lines.slice(start + 1, end);
}

function listValues(lines, key) {
  const start = lines.findIndex((line) => line === `  ${key}:`);
  if (start < 0) return [];
  const values = [];
  for (let i = start + 1; i < lines.length; i += 1) {
    if (/^  [A-Za-z_][A-Za-z0-9_]*:/.test(lines[i])) break;
    const match = lines[i].match(/^    -\s+(.+)$/);
    if (match) values.push(cleanScalar(match[1]));
  }
  return values;
}

function pathValues(lines) {
  return lines.flatMap((line) => {
    const match = line.match(/^  - path:\s+(.+)$/);
    return match ? [cleanScalar(match[1])] : [];
  });
}

function extractMap(text) {
  const canonicalPath = text.match(/^  path:\s+(.+)$/m)?.[1];
  const pointerPath = text.match(/^  current_pointer:\s+(.+)$/m)?.[1];
  if (!canonicalPath || !pointerPath) {
    throw new Error("repository-map.yaml: incomplete canonical_physiology");
  }

  const inventory = section(text, "current_inventory");
  const cycles = listValues(inventory, "cycle_records").map(
    (id) => `${DOMAIN_ROOT}/observation/cycles/${id}.yaml`,
  );
  const events = listValues(inventory, "observation_events").map((id) => {
    const match = id.match(/^EP-EVENT-(\d{4})(\d{2})\d{2}-/);
    if (!match) throw new Error(`Invalid observation event ID: ${id}`);
    return `${DOMAIN_ROOT}/observation/events/${match[1]}/${match[2]}/${id}.yaml`;
  });

  const required = pathValues(section(text, "required_singletons"));
  const derived = listValues(inventory, "derived_indexes");
  const declaredDomainFiles = new Set(
    [...required, ...cycles, ...events, ...derived].filter(
      (entry) => entry.startsWith(`${DOMAIN_ROOT}/`) && !entry.endsWith("/"),
    ),
  );

  const repeatable = section(text, "repeatable_patterns").flatMap((line) => {
    const match = line.match(/^  - pattern:\s+(.+)$/);
    return match ? [cleanScalar(match[1])] : [];
  });

  return {
    canonicalPath: cleanScalar(canonicalPath),
    pointerPath: cleanScalar(pointerPath),
    declaredDomainFiles,
    orientationPaths: pathValues(section(text, "top_level_logical_structure")),
    repeatable,
  };
}

function extractTopology(text) {
  const heading = "### 14.1 / CANONICAL.REPOSITORY.TOPOLOGY";
  const start = text.indexOf(heading);
  if (start < 0) throw new Error(`Physiology: missing ${heading}`);
  const codeStart = text.indexOf("```text", start);
  const codeEnd = text.indexOf("```", codeStart + 7);
  if (codeStart < 0 || codeEnd < 0) {
    throw new Error("Physiology §14.1: missing text topology block");
  }

  const stack = [];
  const files = new Set();
  for (const line of text.slice(codeStart + 7, codeEnd).trim().split(/\r?\n/).slice(1)) {
    const marker = line.search(/[├└]──/u);
    if (marker < 0) continue;
    const depth = Math.floor(marker / 4);
    const name = line
      .slice(marker + 3)
      .replace(/\s+#.*$/, "")
      .trim();
    stack[depth] = name;
    stack.length = depth + 1;
    const repositoryPath = stack.join("");
    if (repositoryPath.startsWith(`${DOMAIN_ROOT}/`) && !repositoryPath.endsWith("/")) {
      files.add(repositoryPath);
    }
  }
  return files;
}

async function walkFiles(root, relative = DOMAIN_ROOT) {
  const entries = await readdir(path.join(root, relative), { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const child = path.posix.join(relative, entry.name);
    if (entry.isDirectory()) files.push(...(await walkFiles(root, child)));
    else if (entry.isFile()) files.push(child);
  }
  return files;
}

function patternRegex(pattern) {
  const tokenized = pattern.replace(/<[^>]+>/g, "__TOKEN__");
  const escaped = tokenized.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`^${escaped.replaceAll("__TOKEN__", "[^/]+")}$`);
}

function compareSets(label, expected, observed, errors) {
  for (const item of expected) {
    if (!observed.has(item)) errors.push(`${label}: missing ${item}`);
  }
  for (const item of observed) {
    if (!expected.has(item)) errors.push(`${label}: unexpected ${item}`);
  }
}

export async function checkDomainDrift(repositoryRoot = process.cwd()) {
  const errors = [];
  const mapPath = path.join(repositoryRoot, DOMAIN_ROOT, "repository-map.yaml");
  const map = extractMap(await readFile(mapPath, "utf8"));
  const physiology = await readFile(path.join(repositoryRoot, map.canonicalPath), "utf8");
  const topologyFiles = extractTopology(physiology);

  compareSets("§14.1 ↔ repository-map", topologyFiles, map.declaredDomainFiles, errors);

  const actualFiles = new Set(await walkFiles(repositoryRoot));
  const archivalPatterns = map.repeatable
    .filter((item) => item.includes("domain-physiology") || item.includes("/protocol/"))
    .map(patternRegex);

  for (const expected of map.declaredDomainFiles) {
    if (!actualFiles.has(expected)) errors.push(`repository: missing ${expected}`);
  }
  for (const actual of actualFiles) {
    if (map.declaredDomainFiles.has(actual)) continue;
    if (archivalPatterns.some((pattern) => pattern.test(actual))) continue;
    errors.push(`repository: unregistered ${actual}`);
  }

  for (const orientationPath of map.orientationPaths) {
    try {
      await readdir(path.join(repositoryRoot, orientationPath));
    } catch (error) {
      if (error.code === "ENOTDIR") {
        try {
          await readFile(path.join(repositoryRoot, orientationPath));
        } catch {
          errors.push(`repository: missing orientation path ${orientationPath}`);
        }
      } else if (error.code === "ENOENT") {
        errors.push(`repository: missing orientation path ${orientationPath}`);
      } else {
        throw error;
      }
    }
  }

  const pointer = await readFile(path.join(repositoryRoot, map.pointerPath), "utf8");
  const linkedName = pointer.match(/\]\(([^)]+)\)/)?.[1];
  if (!linkedName || path.posix.basename(map.canonicalPath) !== path.posix.basename(linkedName)) {
    errors.push(`CURRENT pointer does not select ${map.canonicalPath}`);
  }

  return errors;
}

async function main() {
  const errors = await checkDomainDrift();
  if (errors.length) {
    console.error("HOLD-REPOSITORY-PHYSIOLOGY-DRIFT");
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }
  console.log("PASS: §14.1, repository-map.yaml and repository paths are synchronized.");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main().catch((error) => {
    console.error(error.stack || error.message);
    process.exitCode = 1;
  });
}
