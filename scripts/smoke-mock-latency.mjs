#!/usr/bin/env node
/**
 * Live release smoke for the full-mock critical path.
 *
 * Generates a 40-question, multi-section SSC mock while supplying prior
 * history. This exercises the exact code that was previously slow: bounded
 * provider calls, multiple batch groups, candidate headroom, and strict
 * freshness screening. It does not touch Supabase or student attempts.
 */
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
require("@next/env").loadEnvConfig(process.cwd());

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error("ANTHROPIC_API_KEY is required for smoke:mock-latency");
}

const Module = require("module");
const originalResolveFilename = Module._resolveFilename;
Module._resolveFilename = function resolveExamGrindAlias(request, parent, isMain, options) {
  if (request.startsWith("@/")) {
    return originalResolveFilename(
      path.join(process.cwd(), request.slice(2)),
      parent,
      isMain,
      options,
    );
  }
  return originalResolveFilename(request, parent, isMain, options);
};
require("sucrase/register/ts");

const { generateMockQuestions } = require("../lib/anthropic-mock.ts");
const { createMockQuestionFreshnessGuard } = require("../lib/mock-question-identity.ts");

const historicStems = [
  "What is the percentage increase from 100 to 125?",
  "Which Article of the Indian Constitution guarantees equality before law?",
  "A train covers 240 km in four hours. What is its average speed?",
  "Find the simple interest on Rs 5000 at 10 percent per annum for two years.",
  "If SOUTH is coded as TPVUI, how is NORTH coded in the same pattern?",
  "Which river is known as the Sorrow of Bihar?",
  "Choose the synonym of the word meticulous.",
  "What is the value of 15 percent of 240?",
  "In a row of students, Maya is fifteenth from the left and twelfth from the right. How many students are there?",
  "Which Schedule of the Constitution lists the recognised languages of India?",
];

const startedAt = Date.now();
const generated = await generateMockQuestions({
  examSlug: "ssc-cgl",
  examName: "SSC CGL",
  sections: [
    { name: "General Intelligence & Reasoning", questions: 20 },
    { name: "Quantitative Aptitude", questions: 20 },
  ],
  difficulty: "medium",
  previousQuestionStems: historicStems,
});
const elapsedMs = Date.now() - startedAt;

assert.equal(generated.ok, true, "a complete multi-section mock must generate");
if (!generated.ok) process.exit(1);
assert.equal(generated.questions.length, 40, "the full requested question count must be present");
assert.ok(
  elapsedMs < 90_000,
  `a 40-question fresh mock must complete under 90 seconds (took ${elapsedMs}ms)`,
);

const guard = createMockQuestionFreshnessGuard(historicStems);
for (const question of generated.questions) {
  assert.equal(
    guard.isFresh(question.question_text),
    true,
    "every returned question must be fresh against history and this same mock",
  );
  guard.accept(question.question_text);
}

console.log(
  `✓ smoke:mock-latency passed — 40 fresh questions in ${(elapsedMs / 1000).toFixed(1)}s`,
);
