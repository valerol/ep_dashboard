import assert from "node:assert/strict";
import test from "node:test";

import { buildCalendarEvent, desiredEvents } from "../scripts/sync-google-calendar.mjs";

function cycle(overrides = {}) {
  return {
    record_id: "EP-S-20260809-001",
    record_type: "CYCLE_RECORD",
    cycle_instance_id: "EP-S-20260809-001",
    cycle_type_id: "OZON_WEEKLY_SALES_REVIEW",
    occurrence: 2,
    cycle_record_state: "OPEN",
    current_step: "CAPTURE_SCREENSHOT",
    goal: "Проверить продажи Ozon",
    schedule: {
      kind: "CHECK",
      date: "2026-08-14",
      timezone: "Asia/Vladivostok",
      reminder_before: "P1D",
      calendar_publish: true,
      transparency: "transparent",
    },
    ...overrides,
  };
}

test("all-day cycle becomes a stable transparent calendar event", () => {
  const first = buildCalendarEvent(cycle());
  const second = buildCalendarEvent(cycle());
  assert.equal(first.id, second.id);
  assert.deepEqual(first.start, { date: "2026-08-14" });
  assert.deepEqual(first.end, { date: "2026-08-15" });
  assert.equal(first.transparency, "transparent");
  assert.deepEqual(first.reminders, { useDefault: true });
  assert.equal(first.extendedProperties.private.requested_reminder_before, "P1D");
  assert.equal(first.extendedProperties.private.cycle_instance_id, "EP-S-20260809-001");
  assert.match(first.description, /Due: 2026-08-14/);
  assert.match(first.description, /Requested reminder: P1D/);
  assert.match(first.description, /Timezone: Asia\/Vladivostok/);
});

test("closed future cycles disappear while closed past cycles remain", () => {
  const now = new Date("2026-08-09T00:00:00+10:00");
  const future = cycle({ cycle_record_state: "CLOSED" });
  const past = cycle({
    record_id: "EP-S-20260801-001",
    cycle_instance_id: "EP-S-20260801-001",
    cycle_record_state: "CLOSED",
    actual_result: "NO_ACTION",
    schedule: { ...cycle().schedule, date: "2026-08-08" },
  });
  const events = desiredEvents([future, past], now);
  assert.equal(events.size, 1);
  assert.match([...events.values()][0].description, /Result: NO_ACTION/);
});

test("timed cycles require an offset and use the configured duration", () => {
  const timed = cycle({
    schedule: {
      kind: "ACTION",
      datetime: "2026-08-14T10:00:00+10:00",
      timezone: "Asia/Vladivostok",
      duration_minutes: 45,
      reminder_before: "PT2H",
      calendar_publish: true,
    },
  });
  const event = buildCalendarEvent(timed);
  assert.equal(event.start.dateTime, "2026-08-14T00:00:00.000Z");
  assert.equal(event.end.dateTime, "2026-08-14T00:45:00.000Z");
  assert.equal(event.extendedProperties.private.requested_reminder_before, "PT2H");
});

test("publishing requires exactly one temporal field", () => {
  assert.throws(
    () => buildCalendarEvent(cycle({ schedule: { ...cycle().schedule, datetime: "2026-08-14T10:00:00+10:00" } })),
    /exactly one/,
  );
});

test("calendar_publish false produces no event", () => {
  assert.equal(buildCalendarEvent(cycle({ schedule: { ...cycle().schedule, calendar_publish: false } })), null);
});
