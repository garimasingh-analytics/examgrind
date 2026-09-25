import Anthropic from "@anthropic-ai/sdk";
import { generateWithRetry } from "@/lib/anthropic-resilient";

export type GeneratedTopicQuestion = {
  question: string;
  options: { A: string; B: string; C: string; D: string };
  correct: "A" | "B" | "C" | "D";
  explanation?: string;
};

const PRIMARY_MODEL = "claude-haiku-4-5-20251001";
const BACKUP_MODEL = "claude-sonnet-4-5-20250929";
const GENERATION_RECOVERY_PASSES = 2;

const pause = (milliseconds: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, milliseconds));

function parseValidQuestions(text: string, requestedCount: number) {
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim();
  const generated = JSON.parse(cleaned) as GeneratedTopicQuestion[];
  if (!Array.isArray(generated)) throw new Error("Question batch is not an array.");

  const valid = generated.filter(
    (question): question is GeneratedTopicQuestion =>
      !!question &&
      typeof question.question === "string" &&
      !!question.options &&
      ["A", "B", "C", "D"].every(
        (key) => typeof question.options?.[key as "A"] === "string"
      ) &&
      ["A", "B", "C", "D"].includes(question.correct)
  );

  if (valid.length < requestedCount) {
    throw new Error(
      `Question batch only contained ${valid.length}/${requestedCount} valid questions.`
    );
  }
  return valid.slice(0, requestedCount);
}

/**
 * Produces a complete topic quiz or reports a retryable failure. The primary
 * model gets its own network/rate-limit retry budget first; then Sonnet takes
 * over if Haiku is unavailable or has returned malformed JSON. No partial set
 * is allowed to reach persistence.
 */
export async function generateTopicQuizWithRecovery(
  anthropic: Anthropic,
  prompt: string,
  requestedCount: number
) {
  let lastError = "Question generation did not return a complete quiz.";

  for (let pass = 0; pass < GENERATION_RECOVERY_PASSES; pass += 1) {
    if (pass > 0) await pause(1_000 * pass);
    for (const model of [PRIMARY_MODEL, BACKUP_MODEL]) {
      const result = await generateWithRetry(anthropic, {
        model,
        max_tokens: 4000,
        messages: [{ role: "user", content: prompt }],
      });
      if (!result.ok) {
        lastError = result.userMessage;
        continue;
      }

      try {
        return {
          ok: true as const,
          questions: parseValidQuestions(result.text, requestedCount),
        };
      } catch (error) {
        lastError = "Question generation returned an incomplete or malformed batch.";
        console.error("[quiz/start] malformed topic-quiz batch", {
          model,
          pass: pass + 1,
          error,
        });
      }
    }
  }

  return { ok: false as const, error: lastError };
}
