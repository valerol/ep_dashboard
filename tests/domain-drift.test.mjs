import assert from "node:assert/strict";
import test from "node:test";

import { checkDomainDrift } from "../scripts/check-domain-drift.mjs";

test("domain physiology, repository map and domain paths do not drift", async () => {
  assert.deepEqual(await checkDomainDrift(process.cwd()), []);
});
