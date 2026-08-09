#!/usr/bin/env node

import { createHash, createSign } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const CYCLES_DIRECTORY = "data/ep-domain/observation/cycles";
const DEFAULT_TIMEZONE = "Asia/Vladivostok";
const ALLOWED_KINDS = new Set(["ACTION", "CHECK", "DEADLINE", "EXTERNAL_EVENT"]);
const GOOGLE_SCOPE = "https://www.googleapis.com/auth/calendar.events";
const GOOGLE_API = "https://www.googleapis.com/calendar/v3";

function base64url(value) {
  return Buffer.from(value).toString("base64url");
}

function dateParts(date, timezone) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return Object.fromEntries(
    formatter.formatToParts(date).filter((part) => part.type !== "literal").map((part) => [part.type, part.value]),
  );
}

function dateInTimezone(date, timezone) {
  const parts = dateParts(date, timezone);
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function nextDate(dateString) {
  const date = new Date(`${dateString}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}

function eventId(cycleInstanceId) {
  return `ep${createHash("sha256").update(cycleInstanceId).digest("hex").slice(0, 40)}`;
}

function eventDescription(cycle) {
  const due = cycle.schedule?.date || cycle.schedule?.datetime || "NONE";
  const lines = [
    `Cycle: ${cycle.cycle_instance_id}`,
    `Type: ${cycle.cycle_type_id}`,
    `Occurrence: ${cycle.occurrence ?? "NONE"}`,
    `State: ${cycle.cycle_record_state}`,
    `Due: ${due}`,
    `Timezone: ${cycle.schedule?.timezone || DEFAULT_TIMEZONE}`,
    `Requested reminder: ${cycle.schedule?.reminder_before || "P1D"} (viewer calendar default)`,
    `Current step: ${cycle.current_step ?? "NONE"}`,
    `Protocol: ${cycle.protocol_ref ?? "NONE"}`,
    "Evidence policy: description and ID only; no source file",
  ];
  if (cycle.cycle_record_state === "CLOSED") {
    lines.push(`Closure outcome: ${cycle.current_closure_outcome ?? "NONE"}`);
    lines.push(`Result: ${cycle.actual_result ?? "NO_FINAL_RESULT"}`);
  }
  return lines.join("\n");
}

function validateSchedule(cycle) {
  const schedule = cycle.schedule;
  if (!schedule?.calendar_publish) return null;
  if (!ALLOWED_KINDS.has(schedule.kind)) {
    throw new Error(`${cycle.cycle_instance_id}: invalid schedule.kind ${schedule.kind}`);
  }
  const temporalFields = [schedule.date, schedule.datetime].filter(Boolean);
  if (temporalFields.length !== 1) {
    throw new Error(`${cycle.cycle_instance_id}: schedule requires exactly one of date or datetime`);
  }
  if (schedule.date && !/^\d{4}-\d{2}-\d{2}$/.test(schedule.date)) {
    throw new Error(`${cycle.cycle_instance_id}: invalid schedule.date ${schedule.date}`);
  }
  if (schedule.datetime && !/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(schedule.datetime)) {
    throw new Error(`${cycle.cycle_instance_id}: schedule.datetime requires an explicit offset`);
  }
  return schedule;
}

export function buildCalendarEvent(cycle) {
  const schedule = validateSchedule(cycle);
  if (!schedule) return null;
  const timezone = schedule.timezone || DEFAULT_TIMEZONE;
  const requestedReminder = schedule.reminder_before || "P1D";
  const allDay = Boolean(schedule.date);
  let start;
  let end;

  if (allDay) {
    start = { date: schedule.date };
    end = { date: nextDate(schedule.date) };
  } else {
    const startDate = new Date(schedule.datetime);
    if (Number.isNaN(startDate.valueOf())) {
      throw new Error(`${cycle.cycle_instance_id}: invalid schedule.datetime ${schedule.datetime}`);
    }
    const duration = Number(schedule.duration_minutes || 30);
    if (!Number.isInteger(duration) || duration <= 0) {
      throw new Error(`${cycle.cycle_instance_id}: duration_minutes must be a positive integer`);
    }
    start = { dateTime: startDate.toISOString(), timeZone: timezone };
    end = { dateTime: new Date(startDate.valueOf() + duration * 60_000).toISOString(), timeZone: timezone };
  }

  return {
    id: eventId(cycle.cycle_instance_id),
    summary: schedule.title || `Elephant Pants · ${cycle.goal || cycle.cycle_type_id}`,
    description: eventDescription(cycle),
    start,
    end,
    transparency: schedule.transparency || (allDay ? "transparent" : "opaque"),
    reminders: { useDefault: true },
    extendedProperties: {
      private: {
        epManaged: "true",
        cycle_instance_id: cycle.cycle_instance_id,
        cycle_record_state: cycle.cycle_record_state,
        schedule_kind: schedule.kind,
        requested_reminder_before: requestedReminder,
      },
    },
  };
}

function eventDate(event, timezone) {
  if (event.start.date) return event.start.date;
  return dateInTimezone(new Date(event.start.dateTime), timezone);
}

export function desiredEvents(cycles, now = new Date(), timezone = DEFAULT_TIMEZONE) {
  const today = dateInTimezone(now, timezone);
  const desired = new Map();
  for (const cycle of cycles) {
    const event = buildCalendarEvent(cycle);
    if (!event) continue;
    const closedBeforeDue = cycle.cycle_record_state === "CLOSED" && eventDate(event, timezone) > today;
    if (!closedBeforeDue) desired.set(event.id, event);
  }
  return desired;
}

export async function readCycles(repositoryRoot = process.cwd()) {
  const directory = path.join(repositoryRoot, CYCLES_DIRECTORY);
  const files = (await readdir(directory)).filter((file) => file.endsWith(".yaml") && file !== "README.yaml").sort();
  const cycles = [];
  for (const file of files) {
    const cycle = yaml.load(await readFile(path.join(directory, file), "utf8"));
    if (cycle.record_type !== "CYCLE_RECORD") continue;
    if (cycle.record_id !== cycle.cycle_instance_id) throw new Error(`${file}: record_id must equal cycle_instance_id`);
    cycles.push(cycle);
  }
  return cycles;
}

function parseServiceAccount(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
  }
}

async function accessToken(serviceAccount) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = base64url(JSON.stringify({
    iss: serviceAccount.client_email,
    scope: GOOGLE_SCOPE,
    aud: serviceAccount.token_uri || "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  }));
  const unsigned = `${header}.${claims}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  const assertion = `${unsigned}.${signer.sign(serviceAccount.private_key, "base64url")}`;
  const response = await fetch(serviceAccount.token_uri || "https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion }),
  });
  if (!response.ok) throw new Error(`Google OAuth failed (${response.status}): ${await response.text()}`);
  return (await response.json()).access_token;
}

async function googleRequest(token, url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json", ...options.headers },
  });
  if (!response.ok) throw new Error(`Google Calendar API failed (${response.status}): ${await response.text()}`);
  return response.status === 204 ? null : response.json();
}

async function listManagedEvents(token, calendarId) {
  const events = [];
  let pageToken;
  do {
    const params = new URLSearchParams({
      privateExtendedProperty: "epManaged=true",
      showDeleted: "false",
      singleEvents: "true",
      maxResults: "2500",
    });
    if (pageToken) params.set("pageToken", pageToken);
    const page = await googleRequest(token, `${GOOGLE_API}/calendars/${encodeURIComponent(calendarId)}/events?${params}`);
    events.push(...(page.items || []));
    pageToken = page.nextPageToken;
  } while (pageToken);
  return events;
}

function comparable(event) {
  return JSON.stringify({
    summary: event.summary,
    description: event.description,
    start: event.start,
    end: event.end,
    transparency: event.transparency,
    reminders: event.reminders,
    extendedProperties: event.extendedProperties,
  });
}

export async function synchronize({ cycles, calendarId, serviceAccount, now = new Date() }) {
  const timezone = DEFAULT_TIMEZONE;
  const today = dateInTimezone(now, timezone);
  const desired = desiredEvents(cycles, now, timezone);
  const token = await accessToken(serviceAccount);
  const remote = await listManagedEvents(token, calendarId);
  const remoteById = new Map(remote.map((event) => [event.id, event]));
  const result = { created: [], updated: [], deleted: [], unchanged: [] };

  for (const [id, event] of desired) {
    const existing = remoteById.get(id);
    const eventUrl = `${GOOGLE_API}/calendars/${encodeURIComponent(calendarId)}/events/${id}`;
    if (!existing) {
      await googleRequest(token, `${GOOGLE_API}/calendars/${encodeURIComponent(calendarId)}/events`, {
        method: "POST",
        body: JSON.stringify(event),
      });
      result.created.push(event.extendedProperties.private.cycle_instance_id);
    } else if (comparable(existing) !== comparable(event)) {
      await googleRequest(token, eventUrl, { method: "PUT", body: JSON.stringify(event) });
      result.updated.push(event.extendedProperties.private.cycle_instance_id);
    } else {
      result.unchanged.push(event.extendedProperties.private.cycle_instance_id);
    }
    remoteById.delete(id);
  }

  for (const event of remoteById.values()) {
    if (eventDate(event, timezone) <= today) continue;
    await googleRequest(
      token,
      `${GOOGLE_API}/calendars/${encodeURIComponent(calendarId)}/events/${event.id}`,
      { method: "DELETE" },
    );
    result.deleted.push(event.extendedProperties?.private?.cycle_instance_id || event.id);
  }
  return result;
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const apply = process.argv.includes("--apply");
  if (!dryRun && !apply) throw new Error("Choose --dry-run or --apply explicitly");
  const cycles = await readCycles();
  const desired = desiredEvents(cycles);
  if (dryRun) {
    console.log(JSON.stringify({
      mode: "dry-run",
      timezone: DEFAULT_TIMEZONE,
      event_count: desired.size,
      cycles: [...desired.values()].map((event) => event.extendedProperties.private.cycle_instance_id),
    }, null, 2));
    return;
  }

  const calendarId = process.env.EP_GOOGLE_CALENDAR_ID;
  const credentials = process.env.GOOGLE_CALENDAR_SERVICE_ACCOUNT_JSON;
  if (!calendarId || !credentials) {
    throw new Error("EP_GOOGLE_CALENDAR_ID and GOOGLE_CALENDAR_SERVICE_ACCOUNT_JSON are required for --apply");
  }
  const result = await synchronize({ cycles, calendarId, serviceAccount: parseServiceAccount(credentials) });
  console.log(JSON.stringify({ mode: "apply", ...result }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main().catch((error) => {
    console.error(error.stack || error.message);
    process.exitCode = 1;
  });
}
