import { normalizeMockQuestionStem } from "@/lib/mock-question-identity";
import { createAdminSupabase } from "@/lib/supabase/admin";

type AdminSupabase = ReturnType<typeof createAdminSupabase>;

const HISTORY_LIMIT = 20_000;
const ATTEMPT_LIMIT = 500;
const PAGE_SIZE = 1_000;
const ATTEMPT_CHUNK_SIZE = 100;

type ExposureRow = { question_text: string | null };
type IdRow = { id: string };

function isMissingExposureTable(error: { code?: string; message?: string } | null) {
  if (!error) return false;
  return (
    error.code === "42P01" ||
    error.code === "PGRST205" ||
    /mock_question_exposures|schema cache/i.test(error.message ?? "")
  );
}

function stringsFromRows(rows: ExposureRow[] | null | undefined) {
  return (rows ?? [])
    .map((row) => row.question_text?.trim())
    .filter((question): question is string => Boolean(question));
}

/**
 * Loads prior mock stems for one student and one exam. Newer deployments use
 * the compact exposure catalogue. During the safe rollout of its migration,
 * we fall back to the already-persisted attempt-question rows, so the API
 * never silently stops checking history just because a schema change lags.
 */
export async function loadSeenMockQuestionStems(
  admin: AdminSupabase,
  input: { userId: string; examId: string }
): Promise<string[]> {
  const exposureRows: string[] = [];
  let exposureAvailable = true;

  for (let from = 0; from < HISTORY_LIMIT; from += PAGE_SIZE) {
    const { data, error } = await admin
      .from("mock_question_exposures")
      .select("question_text")
      .eq("user_id", input.userId)
      .eq("exam_id", input.examId)
      .order("last_seen_at", { ascending: false })
      .range(from, from + PAGE_SIZE - 1);

    if (error) {
      if (!isMissingExposureTable(error)) {
        throw new Error(`Could not load mock-question history: ${error.message}`);
      }
      exposureAvailable = false;
      break;
    }

    const batch = stringsFromRows(data as ExposureRow[] | null);
    exposureRows.push(...batch);
    if (batch.length < PAGE_SIZE) break;
  }

  if (exposureAvailable && exposureRows.length > 0) {
    return exposureRows;
  }

  // Safe fallback for existing production data and for the period before the
  // optional compact history migration is applied.
  const { data: mockRows, error: mockError } = await admin
    .from("mock_tests")
    .select("id")
    .eq("exam_id", input.examId);
  if (mockError) {
    throw new Error(`Could not find this exam's mock catalog: ${mockError.message}`);
  }

  const mockIds = ((mockRows ?? []) as IdRow[]).map((row) => row.id);
  if (mockIds.length === 0) return [];

  const { data: attemptRows, error: attemptError } = await admin
    .from("mock_attempts")
    .select("id")
    .eq("user_id", input.userId)
    .in("mock_test_id", mockIds)
    .order("started_at", { ascending: false })
    .limit(ATTEMPT_LIMIT);
  if (attemptError) {
    throw new Error(`Could not load prior mock attempts: ${attemptError.message}`);
  }

  const attemptIds = ((attemptRows ?? []) as IdRow[]).map((row) => row.id);
  if (attemptIds.length === 0) return [];

  const stems: string[] = [];
  for (let chunkStart = 0; chunkStart < attemptIds.length && stems.length < HISTORY_LIMIT; chunkStart += ATTEMPT_CHUNK_SIZE) {
    const attemptChunk = attemptIds.slice(chunkStart, chunkStart + ATTEMPT_CHUNK_SIZE);
    for (let from = 0; stems.length < HISTORY_LIMIT; from += PAGE_SIZE) {
      const { data, error } = await admin
        .from("mock_attempt_questions")
        .select("question_text")
        .in("attempt_id", attemptChunk)
        .order("created_at", { ascending: false })
        .range(from, from + Math.min(PAGE_SIZE, HISTORY_LIMIT - stems.length) - 1);

      if (error) {
        throw new Error(`Could not load prior mock questions: ${error.message}`);
      }

      const batch = stringsFromRows(data as ExposureRow[] | null);
      stems.push(...batch);
      if (batch.length < PAGE_SIZE) break;
    }
  }

  return stems;
}

/**
 * Best-effort write-through cache for production-scale history checks. The
 * canonical source remains mock_attempt_questions, so a missing optional
 * table cannot block a paid student's quiz or weaken the fallback guard.
 */
export async function recordMockQuestionStems(
  admin: AdminSupabase,
  input: { userId: string; examId: string; attemptId: string; questions: string[] }
) {
  const rows = input.questions
    .map((questionText) => ({
      user_id: input.userId,
      exam_id: input.examId,
      attempt_id: input.attemptId,
      question_fingerprint: normalizeMockQuestionStem(questionText),
      question_text: questionText,
      last_seen_at: new Date().toISOString(),
    }))
    .filter((row) => row.question_fingerprint.length > 0);

  if (rows.length === 0) return;

  try {
    const { error } = await admin
      .from("mock_question_exposures")
      .upsert(rows, { onConflict: "user_id,exam_id,question_fingerprint" });

    if (error && !isMissingExposureTable(error)) {
      // This must never make a correctly saved mock unavailable. The route
      // will still read its durable question rows on the next start.
      console.error("[mock/history] exposure catalogue write failed", error);
    }
  } catch (error) {
    // A transport failure after the mock was persisted cannot undo the
    // student-facing success. The next mock start falls back to the durable
    // mock_attempt_questions rows if the cache has not been written yet.
    console.error("[mock/history] exposure catalogue request threw", error);
  }
}
