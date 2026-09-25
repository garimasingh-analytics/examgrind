import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { FREE_LIMITS } from "@/lib/freemium";
import {
  generateMockQuestions,
  type GeneratedQuestion,
  type MockSection,
} from "@/lib/anthropic-mock";
import {
  isMockDifficulty,
  type MockDifficulty,
} from "@/lib/mock-question-identity";
import {
  loadSeenMockQuestionStems,
  recordMockQuestionStems,
} from "@/lib/mock-question-history";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// A full fresh mock may make controlled, retry-safe generation passes. Keep
// this aligned with the other AI routes rather than letting Vercel cut a
// healthy recovery short and return a generic 5xx to the student.
export const maxDuration = 300;

const DATABASE_RETRY_DELAYS = [0, 500, 1_500];
const GENERATION_RECOVERY_PASSES = 2;

const pause = (milliseconds: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, milliseconds));

async function loadFreshnessHistoryWithRetry(
  admin: ReturnType<typeof createAdminSupabase>,
  input: { userId: string; examId: string }
) {
  let lastError: unknown;
  for (const delay of DATABASE_RETRY_DELAYS) {
    if (delay) await pause(delay);
    try {
      return await loadSeenMockQuestionStems(admin, input);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

async function createAttemptWithRetry(
  admin: ReturnType<typeof createAdminSupabase>,
  input: { userId: string; mockTestId: string }
) {
  // Give this start request a stable ID before the first write. If a network
  // response is lost after Postgres commits, the retry can safely recognise
  // the same attempt instead of silently making a second one.
  const attemptId = crypto.randomUUID();
  let lastError: unknown;

  for (const delay of DATABASE_RETRY_DELAYS) {
    if (delay) await pause(delay);
    const { data, error } = await admin
      .from("mock_attempts")
      .insert({
        id: attemptId,
        user_id: input.userId,
        mock_test_id: input.mockTestId,
        status: "in_progress",
      })
      .select("id")
      .maybeSingle();

    if (!error && data?.id) return data.id as string;

    // A duplicate ID means the earlier write likely succeeded even though
    // its response did not reach this function. Treat the durable attempt as
    // the successful result rather than creating another start.
    if (error?.code === "23505") {
      const { data: existing } = await admin
        .from("mock_attempts")
        .select("id")
        .eq("id", attemptId)
        .maybeSingle();
      if (existing?.id) return existing.id as string;
    }

    lastError = error;
  }

  throw lastError ?? new Error("Unable to create mock attempt.");
}

async function saveQuestionsWithRetry(
  admin: ReturnType<typeof createAdminSupabase>,
  input: { attemptId: string; questions: GeneratedQuestion[] }
) {
  const rows = input.questions.map((question) => ({
    attempt_id: input.attemptId,
    section_name: question.section_name,
    question_index: question.question_index,
    question_text: question.question_text,
    option_a: question.option_a,
    option_b: question.option_b,
    option_c: question.option_c,
    option_d: question.option_d,
    correct_answer: question.correct_answer,
    explanation: question.explanation ?? null,
  }));

  let lastError: unknown;
  for (const delay of DATABASE_RETRY_DELAYS) {
    if (delay) await pause(delay);
    const { error } = await admin.from("mock_attempt_questions").insert(rows);
    if (!error) return;

    // A duplicate response on a retry is safe if the full question set is
    // already present. This prevents a transient Supabase connection issue
    // from turning a completed save into a student-visible failure.
    if (error.code === "23505") {
      const { count, error: countError } = await admin
        .from("mock_attempt_questions")
        .select("id", { count: "exact", head: true })
        .eq("attempt_id", input.attemptId);
      if (!countError && count === rows.length) return;
    }

    lastError = error;
  }

  throw lastError ?? new Error("Unable to save mock questions.");
}

/**
 * POST /api/mock/start
 * Body: { mockTestId: string, difficulty?: "easy" | "medium" | "hard" }
 *
 * Creates a mock_attempts row, generates the full question set in
 * parallel batches via Claude, rejects every repeat from the student's
 * earlier mocks, persists mock_attempt_questions, and bumps
 * users.mock_tests_started for the freemium gate.
 *
 * Returns: { attemptId: string }
 *
 * The user is then redirected to /mock/take/[attemptId] which renders
 * the strict timed UI. Re-entering /mock/take/[attemptId] later is a
 * no-op because mock_attempts.status is still 'in_progress'.
 */
export async function POST(req: NextRequest) {
  // ---- 1. Auth ----
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  // ---- 2. Body ----
  let body: { mockTestId?: string; difficulty?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const mockTestId = body.mockTestId;
  if (!mockTestId || typeof mockTestId !== "string") {
    return NextResponse.json({ error: "Missing mockTestId." }, { status: 400 });
  }
  const requestedDifficulty = body.difficulty ?? "medium";
  if (!isMockDifficulty(requestedDifficulty)) {
    return NextResponse.json({ error: "Choose Easy, Medium, or Difficult." }, { status: 400 });
  }
  const difficulty: MockDifficulty = requestedDifficulty;

  // ---- 3. Load the mock catalog row + exam slug ----
  const { data: mockRow, error: mockErr } = await supabase
    .from("mock_tests")
    .select(
      "id, exam_id, slug, display_name, duration_seconds, total_questions, sections, exam:exams(slug, name), is_active"
    )
    .eq("id", mockTestId)
    .maybeSingle();

  if (mockErr || !mockRow) {
    return NextResponse.json({ error: "Mock test not found." }, { status: 404 });
  }

  type MockRow = {
    id: string;
    exam_id: string;
    slug: string;
    display_name: string;
    duration_seconds: number;
    total_questions: number;
    sections: MockSection[];
    exam: { slug: string; name: string } | null;
    is_active: boolean;
  };
  const mock = mockRow as unknown as MockRow;

  if (!mock.is_active) {
    return NextResponse.json(
      { error: "This mock test is no longer active." },
      { status: 410 }
    );
  }

  // ---- 4. Don't create a second in-progress attempt for the same mock ----
  const admin = createAdminSupabase();
  const { data: existing, error: existingError } = await admin
    .from("mock_attempts")
    .select("id, status, started_at")
    .eq("user_id", user.id)
    .eq("mock_test_id", mock.id)
    .eq("status", "in_progress")
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingError) {
    console.error("[mock/start] existing-attempt lookup failed", existingError);
    return NextResponse.json(
      {
        error:
          "We are reconnecting to your practice history. Please keep this page open while we retry.",
        retryable: true,
      },
      { status: 503 }
    );
  }

  if (existing?.id) {
    // Never resume a half-saved attempt. A previous runtime can die after
    // creating its parent row but before inserting every question; resuming
    // that row would send the student into a broken test screen.
    const { count, error: countError } = await admin
      .from("mock_attempt_questions")
      .select("id", { count: "exact", head: true })
      .eq("attempt_id", existing.id);

    if (!countError && count === mock.total_questions) {
      // Resume rather than duplicate. The freemium counter stays at its
      // current value (we never double-bumped).
      return NextResponse.json({ attemptId: existing.id, resumed: true });
    }

    console.warn("[mock/start] removing incomplete in-progress attempt", {
      attemptId: existing.id,
      questionCount: count,
      expectedQuestionCount: mock.total_questions,
      countError,
    });
    const { error: cleanupError } = await admin
      .from("mock_attempts")
      .delete()
      .eq("id", existing.id);
    if (cleanupError) {
      console.error("[mock/start] incomplete-attempt cleanup failed", cleanupError);
      return NextResponse.json(
        {
          error:
            "We are repairing the last unfinished mock. Please keep this page open while we retry.",
          retryable: true,
        },
        { status: 503 }
      );
    }
  }

  // ---- 5. Load every earlier question this student saw for this exam ----
  // If history cannot be read, do not gamble with a potentially repeated mock.
  let previousQuestionStems: string[];
  try {
    previousQuestionStems = await loadFreshnessHistoryWithRetry(admin, {
      userId: user.id,
      examId: mock.exam_id,
    });
  } catch (historyError) {
    console.error("[mock/start] freshness history unavailable", historyError);
    return NextResponse.json(
      {
        error:
          "We are checking your earlier mocks to keep this one fresh. Please keep this page open while we retry.",
        retryable: true,
      },
      { status: 503 }
    );
  }

  // ---- 6. Atomically reserve the free mock before generation ----
  const { data: slotRows, error: slotError } = await admin.rpc(
    "consume_freemium_slot",
    { p_user_id: user.id, p_gate: "mock", p_limit: FREE_LIMITS.mock },
  );
  const slot = Array.isArray(slotRows) ? slotRows[0] : slotRows;
  if (slotError || !slot) {
    console.error("[mock/start] entitlement check failed", slotError);
    return NextResponse.json(
      {
        error: "We are checking your access and will retry automatically.",
        retryable: true,
      },
      { status: 503 }
    );
  }
  if (!slot.allowed) {
    return NextResponse.json({
      error: "You've used your 1 free mock test. Upgrade to take more full-length mocks.",
      paywall: { reason: "mock-limit", currentTier: "free", used: slot.used, limit: FREE_LIMITS.mock },
    }, { status: 402 });
  }

  // ---- 7. Generate questions ----
  // The generator itself has bounded provider retries, controlled batch
  // concurrency, a second-model fallback and six replacement rounds. This
  // outer pass protects against a rare whole-run interruption without ever
  // writing a partial mock.
  let questions: GeneratedQuestion[] | null = null;
  for (let pass = 0; pass < GENERATION_RECOVERY_PASSES; pass += 1) {
    if (pass > 0) await pause(1_000 * pass);
    const generated = await generateMockQuestions({
      examSlug: mock.exam?.slug ?? "cuet",
      examName: mock.exam?.name ?? "CUET UG",
      sections: mock.sections,
      difficulty,
      previousQuestionStems,
    });
    if (generated.ok) {
      questions = generated.questions;
      break;
    }
    console.error("[mock/start] fresh-mock generation pass failed", {
      pass: pass + 1,
      examSlug: mock.exam?.slug,
      mockId: mock.id,
      error: generated.error,
    });
  }

  if (!questions) {
    return NextResponse.json(
      {
        // Keep provider internals in the log above. The client recognises
        // retryable responses and continues automatically rather than
        // presenting a raw provider failure to the student.
        error:
          "We are still building a fresh mock and will retry automatically. Keep this page open for a moment.",
        retryable: true,
      },
      { status: 503 }
    );
  }

  // ---- 8. Persist attempt + question rows ----
  let attemptId: string;
  try {
    attemptId = await createAttemptWithRetry(admin, {
      userId: user.id,
      mockTestId: mock.id,
    });
  } catch (attemptError) {
    console.error("[mock/start] attempt insert failed", attemptError);
    return NextResponse.json(
      {
        error:
          "We are saving your fresh mock and will retry automatically. Keep this page open for a moment.",
        retryable: true,
      },
      { status: 503 }
    );
  }

  try {
    await saveQuestionsWithRetry(admin, { attemptId, questions });
  } catch (questionError) {
    console.error("[mock/start] questions insert failed", questionError);
    // Best-effort cleanup so we don't leave a broken attempt around.
    await admin.from("mock_attempts").delete().eq("id", attemptId);
    return NextResponse.json(
      {
        error:
          "We are saving your fresh mock and will retry automatically. Keep this page open for a moment.",
        retryable: true,
      },
      { status: 503 }
    );
  }

  // Keep a compact, indexed exposure catalogue for future starts. Its
  // best-effort nature cannot break a successfully saved mock: the next
  // request still falls back to mock_attempt_questions if needed.
  await recordMockQuestionStems(admin, {
    userId: user.id,
    examId: mock.exam_id,
    attemptId,
    questions: questions.map((question) => question.question_text),
  });

  return NextResponse.json({ attemptId });
}
