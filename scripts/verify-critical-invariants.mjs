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
    id: "mock-start-history-gate",
    file: "app/api/mock/start/route.ts",
    pattern: /loadSeenMockQuestionStems\(admin/,
    rationale:
      "A paid student reported repeated full-mock questions. Every mock start must load " +
      "the student's earlier stems before generation; removing this guard would silently " +
      "reintroduce the credibility-breaking repeat problem.",
  },
  {
    id: "mock-start-maxDuration",
    file: "app/api/mock/start/route.ts",
    pattern: /export\s+const\s+maxDuration\s*=\s*(?:[3-9]\d{2,}|\d{4,})\s*;/,
    rationale:
      "Full mock generation may use controlled batch concurrency, provider retries, a backup model " +
      "and a whole-run recovery pass. A low function ceiling would convert a healthy recovery into " +
      "a student-facing 5xx before the question set is complete.",
  },
  {
    id: "mock-generator-model-fallback",
    file: "lib/anthropic-mock.ts",
    pattern: /BACKUP_MODEL\s*=\s*["']claude-sonnet-/,
    rationale:
      "A transient Haiku outage must not make full mocks unavailable. The generator needs a separately " +
      "tested backup model after primary retries are exhausted.",
  },
  {
    id: "mock-generator-bounded-concurrency",
    file: "lib/anthropic-mock.ts",
    pattern: /MAX_CONCURRENT_BATCHES\s*=\s*[1-9]\d*;/,
    rationale:
      "Launching every large mock batch simultaneously caused burst rate-limit failures. Bounded " +
      "concurrency is a production reliability requirement, not a performance preference.",
  },
  {
    id: "topic-quiz-start-maxDuration",
    file: "app/api/quiz/start/route.ts",
    pattern: /export\s+const\s+maxDuration\s*=\s*(?:[3-9]\d{2,}|\d{4,})\s*;/,
    rationale:
      "The paid student's topic-quiz flow must have time for transport retries, a backup model and " +
      "a safe full-batch retry. A short route limit would recreate the generic failed-start screen.",
  },
  {
    id: "topic-quiz-generator-fallback",
    file: "lib/topic-quiz-recovery.ts",
    pattern: /generateTopicQuizWithRecovery\(/,
    rationale:
      "The topic quiz shown in the customer screenshot must use its complete-batch, backup-model recovery " +
      "helper instead of making one fragile provider call.",
  },
  {
    id: "topic-quiz-no-generic-server-toast",
    file: "app/topic/[id]/QuestionCountPicker.tsx",
    forbiddenPattern: /server tripped over its feet|Quiz didn.{0,2}t start/i,
    rationale:
      "A paid student received this exact dead-end copy. The topic-quiz screen must retain its " +
      "automatic recovery state rather than restoring a generic error card after a future refactor.",
  },
  {
    id: "mock-start-no-generic-server-toast",
    file: "app/mock/start/[mockTestId]/StartMockButton.tsx",
    forbiddenPattern: /server tripped over its feet|Quiz didn.{0,2}t start/i,
    rationale:
      "Mock starts must retry provider and transport interruptions in place. A generic raw-error card " +
      "would undo the production reliability contract for paid students.",
  },
  {
    id: "mock-generator-local-freshness-gate",
    file: "lib/anthropic-mock.ts",
    pattern: /createMockQuestionFreshnessGuard\(opts\.previousQuestionStems\)/,
    rationale:
      "Prompt wording alone cannot guarantee freshness. The generator must locally reject " +
      "historic and same-attempt duplicates before any attempt is saved.",
  },
  {
    id: "mock-difficulty-selector",
    file: "app/mock/start/[mockTestId]/StartMockButton.tsx",
    pattern: /Choose your difficulty/,
    rationale:
      "Easy, Medium, and Difficult are a committed student-facing mock control and must not " +
      "disappear in a later UI refactor.",
  },
  {
    id: "quiz-deep-dive-fair-use-guard",
    file: "app/api/quiz/analyze/route.ts",
    pattern: /consumeDeepDiveSlot\(supabase, user\.id\)/,
    rationale:
      "Paid Deep Dive is intentionally generous, but Sonnet is costly. The atomic " +
      "daily guard prevents accidental or abusive repeated requests from becoming " +
      "unbounded API spend.",
  },
  {
    id: "mock-deep-dive-fair-use-guard",
    file: "app/api/mock/analyze/route.ts",
    pattern: /consumeDeepDiveSlot\(supabase, user\.id\)/,
    rationale:
      "Full mock Deep Dives are the most expensive AI operation and must retain " +
      "their atomic daily fair-use guard.",
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
  {
    id: "topic-quiz-framing-for-every-live-exam",
    file: "app/api/quiz/start/route.ts",
    pattern: /satisfies\s+Record<LiveExamSlug,\s*string>/,
    rationale:
      "Every live exam needs its own question-generation framing. The framing " +
      "object must be exhaustively type-checked against the catalog's live exams, " +
      "so promoting an exam without quiz support cannot compile or deploy.",
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
  if (inv.pattern && !inv.pattern.test(contents)) {
    failures.push({
      id: inv.id,
      msg: `Pattern not found in ${inv.file}: ${inv.pattern}`,
      rationale: inv.rationale,
    });
    failed++;
  }
  if (inv.forbiddenPattern && inv.forbiddenPattern.test(contents)) {
    failures.push({
      id: inv.id,
      msg: `Forbidden pattern found in ${inv.file}: ${inv.forbiddenPattern}`,
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
