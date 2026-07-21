#!/usr/bin/env node
/**
 * verify-critical-invariants.mjs
 *
 * Runs during `next build` (as a `prebuild` step) and hard-fails the build
 * if any production-critical invariant is violated. This exists because we
 * lost `maxDuration=90` on quiz/analyze twice — once on 2026-07-04, again
 * on 2026-07-17 — with real user + ad-spend impact both times. A silent
 * revert should NEVER be able to reach production again.
 *
 * If this file is deleted or bypassed, that's a redlight action requiring
 * an explicit sign-off comment on the commit.
 *
 * How to add a new invariant:
 *   1. Push an entry into INVARIANTS.
 *   2. `fileMustContain` runs a regex check on the file's contents.
 *   3. Add a rationale — the *why* is what saves the next incident.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const INVARIANTS = [
  {
    id: "quiz-analyze-maxDuration",
    file: "app/api/quiz/analyze/route.ts",
    pattern: /export\s+const\s+maxDuration\s*=\s*(?:[3-9]\d{2,}|\d{4,})\s*;/,
    rationale:
      "Chapter-quiz Deep Analysis is our USP. Requires ≥300s ceiling: " +
      "Haiku 4500tok + optional Sonnet 8000tok + retry backoff (5 attempts × 10s) " +
      "+ Sonnet→Haiku fallback + YouTube resolve + Supabase upsert. On slow-network " +
      "or overloaded-model days the whole chain can burn 60-120s. Regressed " +
      "2026-07-04 AND 2026-07-17 (both with real ad-spend impact). The pattern " +
      "requires the LITERAL number to be ≥ 300, so anyone lowering it silently " +
      "will also fail this guard.",
  },
  {
    id: "mock-analyze-maxDuration",
    file: "app/api/mock/analyze/route.ts",
    pattern: /export\s+const\s+maxDuration\s*=\s*(?:[3-9]\d{2,}|\d{4,})\s*;/,
    rationale:
      "Mock tests are 100-180 questions — Sonnet 10000tok deep dive burns 45-90s " +
      "before ANY retry. Same USP status as chapter-quiz analyze. Value must be ≥ 300.",
  },
  {
    id: "quiz-analysis-structured-output",
    file: "app/api/quiz/analyze/route.ts",
    pattern: /jsonSchemaOutputFormat\(ANALYSIS_JSON_SCHEMA\)/,
    rationale:
      "Deep Analysis must use the SDK schema helper rather than a raw JSON schema. " +
      "The helper strips provider-unsupported constraints before the request, while still " +
      "requiring structured output so partial model JSON cannot become a cached broken UI state.",
  },
  {
    id: "mock-analysis-bounded-context",
    file: "app/api/mock/analyze/route.ts",
    pattern: /selectDiagnosticQuestions\(questions\)/,
    rationale:
      "A full mock has up to 180 questions. The model must receive a bounded diagnostic sample, " +
      "not an unbounded prompt plus an impossible per-question generated response.",
  },
  {
    id: "sms-lib-present",
    file: "lib/sms.ts",
    pattern: /export\s+async\s+function\s+sendAdminSMS/,
    rationale:
      "Real-time SMS to Malkin on any Razorpay paid event. If lib/sms.ts is missing " +
      "or its export is renamed, the billing webhook + verify-payment routes stop " +
      "compiling. Introduced 2026-07-17.",
  },
];

let failed = 0;
const failures = [];

for (const inv of INVARIANTS) {
  const path = join(ROOT, inv.file);
  let contents;
  try {
    contents = readFileSync(path, "utf8");
  } catch (e) {
    failures.push({
      id: inv.id,
      msg: `File missing: ${inv.file}`,
      rationale: inv.rationale,
    });
    failed++;
    continue;
  }
  if (!inv.pattern.test(contents)) {
    failures.push({
      id: inv.id,
      msg: `Pattern not found in ${inv.file}: ${inv.pattern}`,
      rationale: inv.rationale,
    });
    failed++;
  }
}

if (failed > 0) {
  console.error("\n\n" + "═".repeat(70));
  console.error("  BUILD BLOCKED — critical invariant(s) violated");
  console.error("═".repeat(70) + "\n");
  for (const f of failures) {
    console.error(`❌ ${f.id}`);
    console.error(`   ${f.msg}`);
    console.error(`   Why this matters: ${f.rationale}\n`);
  }
  console.error("═".repeat(70));
  console.error("Fix the invariants above and re-run the build.");
  console.error("Full invariants list: scripts/verify-critical-invariants.mjs");
  console.error("═".repeat(70) + "\n");
  process.exit(1);
}

console.log(
  `✓ verify-critical-invariants: all ${INVARIANTS.length} invariant(s) hold.`
);
