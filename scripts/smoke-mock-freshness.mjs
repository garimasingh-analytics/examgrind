#!/usr/bin/env node
/**
 * Live Anthropic smoke test for mock freshness.
 *
 * Generates one tiny SSC CGL mock, then requests a second one while passing
 * the first mock's stems as the student's history. The second set must be
 * fully fresh according to the same guard that protects production attempts.
 * It deliberately does not touch Supabase or create a student attempt.
 */
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
require("@next/env").loadEnvConfig(process.cwd());

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error("ANTHROPIC_API_KEY is required for smoke:mock-freshness");
}

// The app uses the @/ alias. Teach Node how to resolve it for this small
// direct smoke runner, then let Sucrase compile the local TypeScript modules.
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

const { generateMockQuestions } = require("../lib/anthropic-mock.ts");
const { createMockQuestionFreshnessGuard } = require("../lib/mock-question-identity.ts");

const baseRequest = {
  examSlug: "ssc-cgl",
  examName: "SSC CGL",
  sections: [{ name: "Quantitative Aptitude", questions: 3 }],
  difficulty: "medium",
};

const first = await generateMockQuestions({
  ...baseRequest,
  previousQuestionStems: [],
});
assert.equal(first.ok, true, "first mock must generate successfully");
if (!first.ok) process.exit(1);

const historicStems = first.questions.map((question) => question.question_text);
const second = await generateMockQuestions({
  ...baseRequest,
  previousQuestionStems: historicStems,
});
assert.equal(second.ok, true, "second mock must generate successfully");
if (!second.ok) process.exit(1);

const guard = createMockQuestionFreshnessGuard(historicStems);
for (const question of second.questions) {
  assert.equal(
    guard.isFresh(question.question_text),
    true,
    "a generated question must not collide with the student's earlier mock"
  );
  guard.accept(question.question_text);
}

assert.equal(second.questions.length, 3, "second mock must contain all requested questions");
console.log("✓ smoke:mock-freshness passed — live generator returned a fully fresh second mock");
