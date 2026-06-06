import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * PATCH /api/mock/answer
 * Body: {
 *   attemptId: string;
 *   questionIndex: number;
 *   userAnswer?: 'A'|'B'|'C'|'D'|null;  // null = clear
 *   timeSpentSeconds?: number;          // additive (we add to the
 *                                       // running total, not replace)
 *   markedForReview?: boolean;
 * }
 *
 * Called every time the user clicks Save & Next / Mark for Review /
 * navigates between questions. Idempotent — partial updates only touch
 * the fields the client sent.
 *
 * Server-side guards:
 *   - attempt belongs to caller (RLS already enforces this on a
 *     cookie-authed read, but we also verify status='in_progress' so
 *     stale clients can't write after submit/quit)
 */
export async function PATCH(req: NextRequest) {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  let body: {
    attemptId?: string;
    questionIndex?: number;
    userAnswer?: "A" | "B" | "C" | "D" | null;
    timeSpentSeconds?: number;
    markedForReview?: boolean;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const { attemptId, questionIndex } = body;
  if (!attemptId || typeof attemptId !== "string") {
    return NextResponse.json({ error: "Missing attemptId." }, { status: 400 });
  }
  if (!Number.isInteger(questionIndex)) {
    return NextResponse.json({ error: "Missing questionIndex." }, { status: 400 });
  }
  if (
    body.userAnswer !== undefined &&
    body.userAnswer !== null &&
    !["A", "B", "C", "D"].includes(body.userAnswer)
  ) {
    return NextResponse.json({ error: "Bad userAnswer." }, { status: 400 });
  }

  const admin = createAdminSupabase();

  // Verify the attempt is the caller's and still in progress.
  const { data: attempt } = await admin
    .from("mock_attempts")
    .select("id, user_id, status")
    .eq("id", attemptId)
    .maybeSingle();

  if (!attempt || attempt.user_id !== user.id) {
    return NextResponse.json({ error: "Attempt not found." }, { status: 404 });
  }
  if (attempt.status !== "in_progress") {
    return NextResponse.json(
      { error: "This mock has already ended." },
      { status: 409 }
    );
  }

  // Read current row for additive time accumulation.
  const { data: current } = await admin
    .from("mock_attempt_questions")
    .select("id, time_spent_seconds")
    .eq("attempt_id", attemptId)
    .eq("question_index", questionIndex as number)
    .maybeSingle();

  if (!current) {
    return NextResponse.json({ error: "Question not found." }, { status: 404 });
  }

  const patch: Record<string, unknown> = {};
  if (body.userAnswer !== undefined) patch.user_answer = body.userAnswer;
  if (body.markedForReview !== undefined)
    patch.marked_for_review = !!body.markedForReview;
  if (typeof body.timeSpentSeconds === "number" && body.timeSpentSeconds > 0) {
    // Cap so a buggy client can't claim 9 hours on one question.
    const add = Math.min(body.timeSpentSeconds, 3600);
    patch.time_spent_seconds = (current.time_spent_seconds ?? 0) + add;
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ ok: true, noop: true });
  }

  const { error: updErr } = await admin
    .from("mock_attempt_questions")
    .update(patch)
    .eq("id", current.id);

  if (updErr) {
    console.error("[mock/answer] update failed", updErr);
    return NextResponse.json({ error: "Couldn't save answer." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
