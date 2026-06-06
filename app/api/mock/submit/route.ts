import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/mock/submit
 * Body: { attemptId: string }
 *
 * Computes the final score, sectional breakdown, and total time, then
 * flips mock_attempts.status to 'submitted'. Idempotent — submitting
 * an already-submitted attempt returns the cached breakdown.
 *
 * Score formula:
 *   score = positive_marks * correct - negative_marks * wrong
 * (Unattempted: 0; matches every Indian competitive exam scoring rule.)
 */
export async function POST(req: NextRequest) {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  let body: { attemptId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const attemptId = body.attemptId;
  if (!attemptId || typeof attemptId !== "string") {
    return NextResponse.json({ error: "Missing attemptId." }, { status: 400 });
  }

  const admin = createAdminSupabase();

  const { data: attempt } = await admin
    .from("mock_attempts")
    .select(
      "id, user_id, mock_test_id, status, score, sectional_breakdown, total_correct, total_wrong, total_unattempted, total_time_seconds"
    )
    .eq("id", attemptId)
    .maybeSingle();

  if (!attempt || attempt.user_id !== user.id) {
    return NextResponse.json({ error: "Attempt not found." }, { status: 404 });
  }
  if (attempt.status === "submitted") {
    return NextResponse.json({
      attemptId: attempt.id,
      already: true,
      score: attempt.score,
      sectional_breakdown: attempt.sectional_breakdown,
    });
  }
  if (attempt.status === "abandoned") {
    return NextResponse.json(
      { error: "This mock was abandoned and can't be submitted." },
      { status: 409 }
    );
  }

  // Pull mock config (scoring rules) + all answer rows.
  const { data: mock } = await admin
    .from("mock_tests")
    .select("positive_marks, negative_marks")
    .eq("id", attempt.mock_test_id)
    .maybeSingle();

  if (!mock) {
    return NextResponse.json({ error: "Mock config missing." }, { status: 500 });
  }
  const pos = Number(mock.positive_marks);
  const neg = Number(mock.negative_marks);

  const { data: rows, error: rowsErr } = await admin
    .from("mock_attempt_questions")
    .select(
      "section_name, user_answer, correct_answer, time_spent_seconds, marked_for_review"
    )
    .eq("attempt_id", attemptId);

  if (rowsErr || !rows) {
    return NextResponse.json({ error: "Couldn't read answers." }, { status: 500 });
  }

  type SectionAgg = {
    name: string;
    correct: number;
    wrong: number;
    unattempted: number;
    time_seconds: number;
    score: number;
  };
  const bySection = new Map<string, SectionAgg>();
  let totalCorrect = 0;
  let totalWrong = 0;
  let totalUnattempted = 0;
  let totalTime = 0;

  for (const r of rows) {
    const sec =
      bySection.get(r.section_name) ?? {
        name: r.section_name,
        correct: 0,
        wrong: 0,
        unattempted: 0,
        time_seconds: 0,
        score: 0,
      };

    sec.time_seconds += r.time_spent_seconds ?? 0;
    totalTime += r.time_spent_seconds ?? 0;

    if (!r.user_answer) {
      sec.unattempted += 1;
      totalUnattempted += 1;
    } else if (r.user_answer === r.correct_answer) {
      sec.correct += 1;
      totalCorrect += 1;
    } else {
      sec.wrong += 1;
      totalWrong += 1;
    }
    bySection.set(r.section_name, sec);
  }

  // Per-section score.
  // Array.from(...) — TS strict mode without downlevelIteration can't
  // iterate Map values directly. Same workaround used in earlier files.
  const breakdown: SectionAgg[] = Array.from(bySection.values()).map((s) => {
    s.score = s.correct * pos - s.wrong * neg;
    return s;
  });
  const totalScore = totalCorrect * pos - totalWrong * neg;

  // Persist.
  const { error: updErr } = await admin
    .from("mock_attempts")
    .update({
      status: "submitted",
      submitted_at: new Date().toISOString(),
      score: totalScore,
      total_correct: totalCorrect,
      total_wrong: totalWrong,
      total_unattempted: totalUnattempted,
      total_time_seconds: totalTime,
      sectional_breakdown: breakdown,
    })
    .eq("id", attemptId);

  if (updErr) {
    console.error("[mock/submit] persist failed", updErr);
    return NextResponse.json({ error: "Couldn't save the result." }, { status: 500 });
  }

  // Bump the lifetime mock-completion counter (stats only, doesn't
  // affect the freemium gate — that bumps on start).
  await admin.rpc("increment_mock_tests_taken", { uid: user.id }).then(
    () => undefined,
    async () => {
      // RPC may not exist yet — fall back to a plain read+update.
      const { data: u } = await admin
        .from("users")
        .select("mock_tests_taken")
        .eq("id", user.id)
        .maybeSingle();
      const next = (u?.mock_tests_taken ?? 0) + 1;
      await admin
        .from("users")
        .update({ mock_tests_taken: next })
        .eq("id", user.id);
    }
  );

  return NextResponse.json({
    attemptId,
    score: totalScore,
    total_correct: totalCorrect,
    total_wrong: totalWrong,
    total_unattempted: totalUnattempted,
    total_time_seconds: totalTime,
    sectional_breakdown: breakdown,
  });
}
