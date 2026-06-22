import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { decideStreak } from "@/lib/streak";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Letter = "A" | "B" | "C" | "D";

type CompleteBody = {
  quizId: string;
  /** Map of questionId → user's chosen letter (or null if skipped). */
  answers: Record<string, Letter | null>;
  /** Optional time-per-question in seconds (questionId → seconds). */
  times?: Record<string, number>;
};

const XP_PER_CORRECT = 10;
const COMPLETION_THRESHOLD = 0.7;

export async function POST(req: NextRequest) {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  let body: CompleteBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const { quizId, answers, times = {} } = body;
  if (!quizId || !answers || typeof answers !== "object") {
    return NextResponse.json({ error: "Missing quizId or answers." }, { status: 400 });
  }

  // ---- 1. Load the quiz + questions ----
  const { data: quizRow } = await supabase
    .from("quizzes")
    .select("id, user_id, subject, topic_id, score")
    .eq("id", quizId)
    .maybeSingle();

  if (!quizRow) {
    return NextResponse.json({ error: "Quiz not found." }, { status: 404 });
  }
  if (quizRow.user_id !== user.id) {
    return NextResponse.json({ error: "Not your quiz." }, { status: 403 });
  }
  if (quizRow.score != null) {
    // Idempotency: already completed
    return NextResponse.json({ quizId, alreadyCompleted: true });
  }

  const { data: questionRows } = await supabase
    .from("questions")
    .select("id, correct_answer")
    .eq("quiz_id", quizId);
  const questions = (questionRows ?? []) as Array<{
    id: string;
    correct_answer: Letter;
  }>;
  if (questions.length === 0) {
    return NextResponse.json({ error: "Quiz has no questions." }, { status: 500 });
  }

  // ---- 2. Score + persist per-question user_answer ----
  let correct = 0;
  const updates = questions.map((q) => {
    const ua = answers[q.id] ?? null;
    if (ua && ua === q.correct_answer) correct++;
    return {
      id: q.id,
      user_answer: ua,
      time_taken: times[q.id] ?? null,
    };
  });

  // Persist user_answers — one upsert per question (Supabase doesn't support
  // bulk update by id with mixed values without a CTE, so we run them in parallel).
  await Promise.all(
    updates.map((u) =>
      supabase
        .from("questions")
        .update({ user_answer: u.user_answer, time_taken: u.time_taken })
        .eq("id", u.id)
    )
  );

  const total = questions.length;
  const xp = correct * XP_PER_CORRECT;
  const accuracy = correct / total;

  // ---- 3. Mark quiz complete ----
  await supabase
    .from("quizzes")
    .update({ score: correct, xp_awarded: xp })
    .eq("id", quizId);

  // ---- 4. Award XP + bump quizzes_taken + maintain daily streak ----
  // Read current values first (RLS-friendly, no RPC needed).
  const { data: profile } = await supabase
    .from("users")
    .select(
      "xp, level, quizzes_taken, streak_count, longest_streak, last_active_date, streak_shields, total_shields_used"
    )
    .eq("id", user.id)
    .maybeSingle();

  // A quiz only "counts" toward the streak if the user actually engaged
  // (answered at least one question). Skipping all 5 isn't practice.
  const answeredCount = updates.filter((u) => u.user_answer != null).length;
  const countsAsPractice = answeredCount > 0;

  // Streak calculation (only when countsAsPractice). Routed through
  // decideStreak() in lib/streak.ts which handles the auto-shield-protect
  // case: a 2-day gap with shields ≥ 1 auto-burns one shield and keeps the
  // streak alive. Larger gaps reset regardless.
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const prevDate: string | null = profile?.last_active_date ?? null;
  const prevShields: number = profile?.streak_shields ?? 0;
  const prevStreak: number = profile?.streak_count ?? 0;

  let newStreak = prevStreak;
  let shieldConsumed = false;
  let streakChanged:
    | "incremented"
    | "reset"
    | "same-day"
    | "skipped"
    | "shield-saved" = "same-day";

  if (!countsAsPractice) {
    streakChanged = "skipped";
  } else {
    const decision = decideStreak(prevDate, prevStreak, prevShields);
    newStreak = decision.newStreak;
    shieldConsumed = decision.shieldConsumed;
    streakChanged =
      decision.reason === "first" || decision.reason === "next-day"
        ? "incremented"
        : decision.reason === "shield-saved"
          ? "shield-saved"
          : decision.reason === "reset"
            ? "reset"
            : "same-day";
  }
  const newLongest = Math.max(profile?.longest_streak ?? 0, newStreak);

  if (profile) {
    const newXp = (profile.xp ?? 0) + xp;
    const newLevel = Math.max(1, Math.floor(newXp / 100) + 1);
    const updatePayload: Record<string, unknown> = {
      xp: newXp,
      level: newLevel,
      quizzes_taken: (profile.quizzes_taken ?? 0) + 1,
      streak_count: newStreak,
      longest_streak: newLongest,
    };
    // Only stamp last_active_date when the quiz actually counted as practice.
    if (countsAsPractice) updatePayload.last_active_date = today;
    if (shieldConsumed) {
      updatePayload.streak_shields = Math.max(0, prevShields - 1);
      updatePayload.total_shields_used =
        (profile.total_shields_used ?? 0) + 1;
    }
    await supabase.from("users").update(updatePayload).eq("id", user.id);

    // Log the shield auto-use for the /me history UI. Non-fatal if the
    // log insert fails — the actual streak protection already landed.
    if (shieldConsumed) {
      const admin = createAdminSupabase();
      await admin.from("shield_events").insert({
        user_id: user.id,
        kind: "auto_use",
        xp_cost: null,
        shields_after: Math.max(0, prevShields - 1),
      });
    }
  }

  // ---- 5. Update user_topic_mastery (upsert, accumulate) ----
  if (quizRow.topic_id) {
    const { data: existing } = await supabase
      .from("user_topic_mastery")
      .select("xp, questions_attempted, questions_correct")
      .eq("user_id", user.id)
      .eq("topic_id", quizRow.topic_id)
      .maybeSingle();

    const accumulated = {
      xp: (existing?.xp ?? 0) + xp,
      questions_attempted: (existing?.questions_attempted ?? 0) + total,
      questions_correct: (existing?.questions_correct ?? 0) + correct,
    };

    const acc = accumulated.questions_attempted > 0
      ? accumulated.questions_correct / accumulated.questions_attempted
      : 0;
    const masteryLevel: "novice" | "apprentice" | "adept" | "master" =
      acc >= 0.95 ? "master"
    : acc >= 0.85 ? "adept"
    : acc >= 0.70 ? "apprentice"
    : "novice";

    await supabase.from("user_topic_mastery").upsert(
      {
        user_id: user.id,
        topic_id: quizRow.topic_id,
        ...accumulated,
        mastery_level: masteryLevel,
        last_quizzed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,topic_id" }
    );
  }

  return NextResponse.json({
    quizId,
    correct,
    total,
    accuracy: Math.round(accuracy * 100),
    xpEarned: xp,
    completed: accuracy >= COMPLETION_THRESHOLD,
    streak: {
      count: newStreak,
      longest: newLongest,
      changed: streakChanged, // "incremented" | "reset" | "same-day"
    },
  });
}
