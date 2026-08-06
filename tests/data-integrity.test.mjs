import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readJson = async (name) =>
  JSON.parse(await readFile(new URL(`../data/${name}`, import.meta.url), "utf8"));

const uniqueIds = (items, label) => {
  const ids = items.map((item) => item.id);
  assert.equal(new Set(ids).size, ids.length, `${label}: duplicate id`);
  return new Set(ids);
};

test("project data has valid cross-links and evidence references", async () => {
  const [organs, stages, tasks, news, changelog, registry] = await Promise.all([
    readJson("organs.json"),
    readJson("roadmap.json"),
    readJson("current-step.json"),
    readJson("news.json"),
    readJson("site-changelog.json"),
    readJson("source-registry.json"),
  ]);

  const organIds = uniqueIds(organs, "organs");
  uniqueIds(stages, "roadmap");
  const taskIds = uniqueIds(tasks, "tasks");
  uniqueIds(news, "news");
  const sourceIds = uniqueIds(registry.sources, "sources");

  assert.equal(stages.filter((stage) => stage.current).length, 1, "roadmap must have exactly one current stage");

  for (const stage of stages) {
    stage.organs.forEach((id) => assert.ok(organIds.has(id), `${stage.id}: unknown organ ${id}`));
    stage.sourceIds.forEach((id) => assert.ok(sourceIds.has(id), `${stage.id}: unknown source ${id}`));
  }

  for (const task of tasks) {
    if (task.org) assert.ok(organIds.has(task.org), `${task.id}: unknown owner ${task.org}`);
    task.related.forEach((id) => assert.ok(organIds.has(id), `${task.id}: unknown related organ ${id}`));
    task.sourceIds.forEach((id) => assert.ok(sourceIds.has(id), `${task.id}: unknown source ${id}`));
  }

  for (const item of news) {
    assert.ok(["action", "oper", "cycle_closed"].includes(item.type), `${item.id}: unknown news type`);
    if (item.org) assert.ok(organIds.has(item.org), `${item.id}: unknown organ ${item.org}`);
    if (item.task) assert.ok(taskIds.has(item.task), `${item.id}: unknown task ${item.task}`);
    item.sourceIds.forEach((id) => assert.ok(sourceIds.has(id), `${item.id}: unknown source ${id}`));
  }

  for (const entry of changelog) {
    entry.sourceIds.forEach((id) => assert.ok(sourceIds.has(id), `${entry.title}: unknown source ${id}`));
  }
});
