#!/usr/bin/env node
/**
 * Offline regression test for the exact path shown in the paid student's
 * screenshot: a topic-level "Start quiz" request.
 *
 * It makes the primary model return malformed JSON and proves the route helper
 * automatically switches to its backup model and only accepts a complete,
 * valid set — no browser retry or generic error required.
 */
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const Module = require("module");
const originalResolveFilename = Module._resolveFilename;
Module._resolveFilename = function resolveExamGrindAlias(request, parent, isMain, options) {
  if (request.startsWith("@/")) {
    return originalResolveFilename(
      path.join(process.cwd(), request.slice(2)),
      parent,
      isMain,
      options
    );
  }
  return originalResolveFilename(request, parent, isMain, options);
};
require("sucrase/register/ts");

const { generateTopicQuizWithRecovery } = require("../lib/topic-quiz-recovery.ts");

const questions = Array.from({ length: 5 }, (_, index) => ({
  question: `Question ${index + 1}?`,
  options: { A: "A", B: "B", C: "C", D: "D" },
  correct: "A",
  explanation: "A is correct for this controlled recovery test.",
}));

const models = [];
const simulatedClient = {
  messages: {
    create: async (params) => {
      models.push(params.model);
      if (params.model === "claude-haiku-4-5-20251001") {
        return { content: [{ type: "text", text: "definitely not JSON" }] };
      }
      return { content: [{ type: "text", text: JSON.stringify(questions) }] };
    },
  },
};

// The helper correctly logs malformed production batches. Keep this deliberate
// test fixture quiet so its expected fake parse failure does not look like a
// real test failure in CI output.
const originalConsoleError = console.error;
console.error = () => {};
let result;
try {
  result = await generateTopicQuizWithRecovery(
    simulatedClient,
    "Return a quiz.",
    5
  );
} finally {
  console.error = originalConsoleError;
}

assert.equal(result.ok, true, "a malformed primary batch must fall through to backup generation");
if (result.ok) assert.equal(result.questions.length, 5, "a topic quiz must be complete before it is saved");
assert.deepEqual(
  models,
  ["claude-haiku-4-5-20251001", "claude-sonnet-4-5-20250929"],
  "backup model must be used after primary malformed output"
);

console.log("✓ test:topic-quiz-recovery passed — malformed primary output automatically falls back to a complete quiz");
