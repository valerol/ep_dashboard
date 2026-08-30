#!/usr/bin/env node

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import yaml from "js-yaml";

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const child = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(child));
    else if (entry.isFile() && /\.(json|ya?ml)$/.test(entry.name)) files.push(child);
  }
  return files;
}

const files = await walk(path.join(process.cwd(), "data"));
for (const file of files) {
  const source = await readFile(file, "utf8");
  if (file.endsWith(".json")) JSON.parse(source);
  else yaml.load(source);
}
console.log(`PASS: parsed ${files.length} JSON/YAML data files.`);
