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
    pattern: /export\s+const\s+maxDuration\s*=\s*\d+\s*;/,
    rationale:
      "Chapter-quiz Deep Analysis calls Claude Haiku (4500 tok) + optional Sonnet " +
      "deep-dive (8000 tok) + YouTube resolve + Supabase upsert. Vercel default of " +
      "10s silently kills the function partway. Users get a generic toast, ads waste " +
      "money. Regressed 2026-07-04 AND 2026-07-17 — do NOT remove this line without " +
      "confirming Vercel's default runtime cap has changed.",
  },
  {
    id: "mock-analyze-maxDuration",
    file: "app/api/mock/analyze/route.ts",
    pattern: /export\s+const\s+maxDuration\s*=\s*\d+\s*;/,
    rationale:
      "Mock tests are 100-180 questions — Claude spends 30-60s per analysis. Same " +
      "reasoning as quiz/analyze but the failure is even louder because mocks are " +
      "our paid-tier hero feature.",
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
