import assert from "node:assert/strict";
import test from "node:test";
import { validateClosureInput } from "../lib/close-cycle.mjs";

test("accepts the minimal valid closure", () => {
  assert.deepEqual(validateClosureInput({ cycleId: "EP-GP-20260809-001", outcome: "ACHIEVED", comment: "Готово" }), { cycleId: "EP-GP-20260809-001", outcome: "ACHIEVED", comment: "Готово" });
});
test("rejects unsupported outcomes", () => assert.throws(() => validateClosureInput({ cycleId: "EP-GP-20260809-001", outcome: "DONE", comment: "Готово" }), /INVALID_OUTCOME/));
test("rejects an empty operator comment", () => assert.throws(() => validateClosureInput({ cycleId: "EP-GP-20260809-001", outcome: "ACHIEVED", comment: "" }), /INVALID_COMMENT/));
