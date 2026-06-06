import Anthropic from "@anthropic-ai/sdk";
import { generateWithRetry } from "@/lib/anthropic-resilient";

/**
 * Mock-test question generation.
 *
 * A NEET full mock is 180 questions. We can't ask Claude for 180 MCQs
 * in one shot — the response would blow past the function timeout and
 * usually hit context-window limits anyway. Instead we:
 *
 *   • Split each section into batches of ~15 questions.
 *   • Fan all batches across all sections out in parallel.
 *   • Aggregate, validate, and number them sequentially across the
 *     whole attempt (section-first ordering).
 *
 * With Haiku ~5–8s per batch and 12 parallel calls, a 180q NEET mock
 * generates in ~10–12 seconds end-to-end. Well within the Vercel
 * function budget for production tier.
 */

export type MockSection = {
  name: string;
  questions: number;
  subject_slug?: string;
};

export type GeneratedQuestion = {
  section_name: string;
  question_index: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: "A" | "B" | "C" | "D";
  explanation?: string;
};

type RawQ = {
  question: string;
  options: { A: string; B: string; C: string; D: string };
  correct: "A" | "B" | "C" | "D";
  explanation?: string;
};

const BATCH_SIZE = 15;

const EXAM_FRAMING: Record<string, (q: number) => string> = {
  cuet: (q) =>
    `Generate ${q} CUET UG style multiple-choice questions for an Indian undergraduate aspirant. NCERT Class 11–12 conventions. NTA CUET difficulty band — slightly above board level, single-step application as the modal difficulty.`,
  "ssc-cgl": (q) =>
    `Generate ${q} SSC CGL Tier-1 style multiple-choice questions for an Indian graduate aspirant preparing for central-government posts. Match the SSC question style: numeric, time-bound, no fluff. Use Indian context (rupees, Indian names, Indian geography).`,
  "neet-ug": (q) =>
    `Generate ${q} NEET UG style multiple-choice questions for an Indian medical aspirant. Source material strictly NCERT Class 11–12. Match NTA NEET difficulty — concept-heavy, single-correct, plausible distractors drawn from sibling concepts. Use SI units. Biology should reflect NCERT line-by-line phrasing where possible.`,
};

function buildPrompt(
  examSlug: string,
  examName: string,
  section: MockSection,
  count: number,
  batchIdx: number
) {
  const framing = (EXAM_FRAMING[examSlug] ?? EXAM_FRAMING.cuet)(count);
  return `${framing}

Exam: ${examName}
Section: ${section.name}
Batch ${batchIdx + 1} of this section's run.

Rules:
- Each question must have exactly 4 options labelled A, B, C, D, with one correct answer.
- Mix difficulty: ~30% easy, ~50% medium, ~20% hard.
- Stems under 60 words. Options under 20 words each.
- Distractors must be plausible — common student errors, sign flips, conceptual confusions.
- No "All of the above" / "None of the above".
- Provide a one-sentence explanation per question (max 30 words) for the results page.
- Never include disclaimers, meta-commentary, or "as an AI" language.
- Do NOT repeat a question stem from this batch.

Return ONLY a valid JSON array, no prose, no markdown fences:

[
  {
    "question": "...",
    "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
    "correct": "B",
    "explanation": "..."
  }
]`;
}

function parseBatch(text: string): RawQ[] {
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim();
  const parsed = JSON.parse(cleaned);
  if (!Array.isArray(parsed)) throw new Error("not an array");
  return parsed as RawQ[];
}

function validateQ(q: unknown): q is RawQ {
  if (!q || typeof q !== "object") return false;
  const r = q as RawQ;
  return (
    typeof r.question === "string" &&
    !!r.options &&
    ["A", "B", "C", "D"].every(
      (k) => typeof r.options?.[k as "A"] === "string"
    ) &&
    ["A", "B", "C", "D"].includes(r.correct)
  );
}

/**
 * Generate every question for the mock. Returns a flat array, ordered:
 *   section[0] q1..qN, section[1] q1..qN, ...
 * The caller persists exactly as-returned; question_index is set by us.
 */
export async function generateMockQuestions(opts: {
  examSlug: string;
  examName: string;
  sections: MockSection[];
}): Promise<{ ok: true; questions: GeneratedQuestion[] } | { ok: false; error: string }> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return { ok: false, error: "Server missing ANTHROPIC_API_KEY." };
  }
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  // Flatten every section into a list of batch tasks.
  type Task = { section: MockSection; count: number; batchIdx: number };
  const tasks: Task[] = [];
  for (const section of opts.sections) {
    let remaining = section.questions;
    let idx = 0;
    while (remaining > 0) {
      const count = Math.min(BATCH_SIZE, remaining);
      tasks.push({ section, count, batchIdx: idx });
      remaining -= count;
      idx += 1;
    }
  }

  // Fire all batches in parallel; each batch carries section identity.
  const settled = await Promise.allSettled(
    tasks.map(async (t) => {
      const result = await generateWithRetry(anthropic, {
        model: "claude-haiku-4-5-20251001",
        max_tokens: 4000,
        messages: [
          {
            role: "user",
            content: buildPrompt(
              opts.examSlug,
              opts.examName,
              t.section,
              t.count,
              t.batchIdx
            ),
          },
        ],
      });
      if (!result.ok) throw new Error(result.userMessage);
      const raw = parseBatch(result.text);
      return { section: t.section, raw };
    })
  );

  // Bucket per-section, preserving submission order (so question_index
  // is deterministic across retries).
  const bySection = new Map<string, RawQ[]>();
  for (const section of opts.sections) bySection.set(section.name, []);
  for (const r of settled) {
    if (r.status !== "fulfilled") continue;
    const valid = r.value.raw.filter(validateQ);
    bySection.get(r.value.section.name)?.push(...valid);
  }

  // Build the final list. If any section came up short, fail loud —
  // a half-formed mock is worse than no mock.
  const out: GeneratedQuestion[] = [];
  for (const section of opts.sections) {
    const bucket = bySection.get(section.name) ?? [];
    if (bucket.length < section.questions) {
      return {
        ok: false,
        error: `Couldn't generate enough questions for ${section.name} (got ${bucket.length}/${section.questions}). Please try again.`,
      };
    }
    for (let i = 0; i < section.questions; i++) {
      const q = bucket[i];
      out.push({
        section_name: section.name,
        question_index: out.length + 1, // 1-based across the whole attempt
        question_text: q.question,
        option_a: q.options.A,
        option_b: q.options.B,
        option_c: q.options.C,
        option_d: q.options.D,
        correct_answer: q.correct,
        explanation: typeof q.explanation === "string" ? q.explanation : undefined,
      });
    }
  }

  return { ok: true, questions: out };
}
