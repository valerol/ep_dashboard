import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("renders the Elephant Pants project surface", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  const html = await response.text();
  const normalizedHtml = html.replaceAll("\u200b", "");
  assert.match(normalizedHtml, /Elephant Pants/);
  assert.match(normalizedHtml, /философская машина/);
  assert.match(normalizedHtml, /Состояние системы/);
  assert.match(normalizedHtml, /EP-S-20260830-001/);
  assert.match(normalizedHtml, /MONITOR_EXPERIMENTAL_MAIN_IMAGE_FOR_7_DAYS/);
  assert.match(normalizedHtml, /chi-vintagerosemandala-pine/);
  assert.match(normalizedHtml, /chi-ethniclanna-mint/);
  assert.match(normalizedHtml, /6 сентября/);
});

test("projects the latest sales result from canonical domain records", async () => {
  const projection = JSON.parse(await readFile(new URL("../data/site-projection.json", import.meta.url), "utf8"));
  const closedBoostingTest = projection.cycles.find((cycle) => cycle.id === "EP-S-20260822-001");
  const activeCardTest = projection.cycles.find((cycle) => cycle.id === "EP-S-20260830-001");

  assert.equal(closedBoostingTest.state, "CLOSED");
  assert.match(closedBoostingTest.result, /1 заказ на 2 900 ₽/);
  assert.match(closedBoostingTest.result, /4 076 показах/);
  assert.match(closedBoostingTest.result, /898 показов против примерно 894/);
  assert.match(closedBoostingTest.result, /не дал конверсии в продажи/);
  assert.equal(activeCardTest.state, "OPEN");
  assert.equal(activeCardTest.step, "MONITOR_EXPERIMENTAL_MAIN_IMAGE_FOR_7_DAYS");
  assert.equal(activeCardTest.experiment.experimental_sku, "chi-vintagerosemandala-pine");
  assert.equal(activeCardTest.experiment.control_sku, "chi-ethniclanna-mint");
  assert.equal(activeCardTest.schedule.date, "2026-09-06");
  assert.match(activeCardTest.result, /размещена на Ozon/);
});


test("keeps the weekly Ozon sales path visible on the site", async () => {
  const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");

  assert.match(source, /Цены и акции/);
  assert.match(source, /Аналитика по продажам/);
  assert.match(source, /Последние 7 дней/);
});
