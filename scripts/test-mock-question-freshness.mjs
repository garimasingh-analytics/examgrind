#!/usr/bin/env node
/**
 * Fast, offline regression test for the client-visible no-repeat guarantee.
 * It exercises the pure identity guard without calling Anthropic or Supabase.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const source = readFileSync("lib/mock-question-identity.ts", "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const context = { exports: {} };
vm.runInNewContext(compiled, context);

const { createMockQuestionFreshnessGuard } = context.exports;
const guard = createMockQuestionFreshnessGuard([
  "What is the percentage increase from 100 to 125?",
  "Which Article of the Indian Constitution guarantees equality before law?",
]);

assert.equal(
  guard.isFresh("What is the percentage increase from 100 to 125 ?"),
  false,
  "formatting changes must not permit an exact repeat"
);
assert.equal(
  guard.isFresh("What is the percentage increase from 200 to 250?"),
  false,
  "changing only numbers must not permit the same question template"
);
assert.equal(
  guard.isFresh("Which Article guarantees equality before law in the Indian Constitution?"),
  false,
  "a superficial rewording must not permit a familiar stem"
);
assert.equal(
  guard.isFresh("In the Indian Constitution, which Article gives equality before the law?"),
  false,
  "a light rewrite with reordered wording must not permit a familiar stem"
);
assert.equal(
  guard.isFresh("A shop gives a 20% discount on a marked price of Rs 500. What is the selling price?"),
  true,
  "a genuinely different problem may still test another skill"
);

guard.accept("A train covers 240 km in 4 hours. What is its average speed?");
assert.equal(
  guard.isFresh("A train covers 360 km in 6 hours. What is its average speed?"),
  false,
  "questions generated earlier in this same mock must also be screened"
);

console.log("✓ test:mock-freshness passed — repeat stems and shallow variants are rejected");
