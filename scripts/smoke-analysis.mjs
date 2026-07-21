#!/usr/bin/env node
/**
 * Minimal paid API smoke test for the exact production Deep Analysis schema.
 * It sends no student data and costs only a tiny Sonnet response. Run before
 * promoting a change that touches lib/analysis-contract.ts or AI routes.
 */
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";

const require = createRequire(import.meta.url);
require("@next/env").loadEnvConfig(process.cwd());
const ts = require("typescript");
const Anthropic = require("@anthropic-ai/sdk").default;
const { jsonSchemaOutputFormat } = require("@anthropic-ai/sdk/helpers/json-schema");

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error("ANTHROPIC_API_KEY is required for smoke:analysis");
}

const source = readFileSync("lib/analysis-contract.ts", "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const context = { exports: {} };
vm.runInNewContext(compiled, context);
const schema = context.exports.ANALYSIS_JSON_SCHEMA;

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const response = await client.messages.create({
  model: "claude-sonnet-4-6",
  max_tokens: 1000,
  output_config: { format: jsonSchemaOutputFormat(schema) },
  messages: [{
    role: "user",
    content: "Return one compact analysis. Include exactly one strength, one weakness with every required nested field, one pattern, and all three study-plan fields. Keep every string short.",
  }],
});
const text = response.content.filter((block) => block.type === "text").map((block) => block.text).join("");
const analysis = JSON.parse(text);
if (!analysis.verdict || !analysis.studyPlan || analysis.strengths?.length !== 1 || analysis.weaknesses?.length !== 1 || analysis.patterns?.length !== 1) {
  throw new Error("Deep Analysis smoke response was structurally incomplete");
}
console.log("✓ smoke:analysis passed — Sonnet returned valid Deep Analysis JSON");

