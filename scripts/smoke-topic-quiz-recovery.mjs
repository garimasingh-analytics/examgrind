#!/usr/bin/env node
/**
 * Live, no-database smoke test for the paid student's exact topic-quiz path.
 * Calls the route's complete-batch recovery helper with a five-question SSC
 * Quant prompt, then verifies that all five questions are present and shaped
 * correctly. No user, quiz, question or billing data is created.
 */
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
require("@next/env").loadEnvConfig(process.cwd());
if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error("ANTHROPIC_API_KEY is required for smoke:topic-quiz-recovery");
}

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

const Anthropic = require("@anthropic-ai/sdk").default;
const { generateTopicQuizWithRecovery } = require("../lib/topic-quiz-recovery.ts");

const prompt = `Generate 5 original SSC CGL Quantitative Aptitude questions on percentages.
Rules: exactly four options A, B, C, D; one correct answer; one short explanation; no prose outside JSON.
Return ONLY this JSON array shape:
[{"question":"...","options":{"A":"...","B":"...","C":"...","D":"..."},"correct":"A","explanation":"..."}]`;

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const result = await generateTopicQuizWithRecovery(anthropic, prompt, 5);
assert.equal(result.ok, true, "live topic-quiz recovery must produce a quiz");
if (result.ok) {
  assert.equal(result.questions.length, 5, "live topic quiz must be complete");
  for (const question of result.questions) {
    assert.equal(typeof question.question, "string");
    assert.ok(question.question.trim().length > 0);
    assert.ok(["A", "B", "C", "D"].includes(question.correct));
  }
}

console.log("✓ smoke:topic-quiz-recovery passed — live topic-quiz path returned a complete valid quiz");
