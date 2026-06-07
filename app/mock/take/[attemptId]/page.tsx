import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import MockTakeClient from "./MockTakeClient";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ attemptId: string }> };

type AttemptRow = {
  id: string;
  user_id: string;
  mock_test_id: string;
  status: "in_progress" | "submitted" | "abandoned";
  started_at: string;
};

type MockRow = {
  id: string;
  display_name: string;
  duration_seconds: number;
  total_questions: number;
};

type QuestionRow = {
  id: string;
  section_name: string;
  question_index: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  user_answer: "A" | "B" | "C" | "D" | null;
  marked_for_review: boolean;
  time_spent_seconds: number;
};

/**
 * /mock/take/[attemptId] — the strict timed test taking page.
 *
 * Server fetches the attempt + all questions, validates ownership +
 * status, computes time-remaining from started_at + duration_seconds,
 * and hands a fully-hydrated payload to the client driver.
 *
 * Routing rules:
 *   • Not signed in → /
 *   • Not the owner / no attempt → /mock
 *   • Status submitted → /mock/results/[id]
 *   • Status abandoned → /mock (no resume — strict mode)
 *   • Status in_progress but timer already expired → submit auto
 */
export default async function MockTakeServerPage({ params }: PageProps) {
  const { attemptId } = await params;

  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: attempt } = await supabase
    .from("mock_attempts")
    .select("id, user_id, mock_test_id, status, started_at")
    .eq("id", attemptId)
    .maybeSingle<AttemptRow>();

  if (!attempt || attempt.user_id !== user.id) redirect("/mock");
  if (attempt.status === "submitted") redirect(`/mock/results/${attemptId}`);
  if (attempt.status === "abandoned") redirect("/mock");

  const { data: mock } = await supabase
    .from("mock_tests")
    .select("id, display_name, duration_seconds, total_questions")
    .eq("id", attempt.mock_test_id)
    .maybeSingle<MockRow>();

  if (!mock) redirect("/mock");

  const { data: questions } = await supabase
    .from("mock_attempt_questions")
    .select(
      "id, section_name, question_index, question_text, option_a, option_b, option_c, option_d, user_answer, marked_for_review, time_spent_seconds"
    )
    .eq("attempt_id", attemptId)
    .order("question_index", { ascending: true });

  const qs = (questions ?? []) as QuestionRow[];
  if (qs.length === 0) redirect("/mock");

  // Time remaining = duration - (now - started_at). Floor at 0 so
  // negative values don't crash the client.
  const elapsed = Math.floor(
    (Date.now() - new Date(attempt.started_at).getTime()) / 1000
  );
  const remaining = Math.max(0, mock.duration_seconds - elapsed);

  return (
    <MockTakeClient
      attemptId={attempt.id}
      displayName={mock.display_name}
      initialSecondsRemaining={remaining}
      questions={qs.map((q) => ({
        index: q.question_index,
        sectionName: q.section_name,
        text: q.question_text,
        options: { A: q.option_a, B: q.option_b, C: q.option_c, D: q.option_d },
        userAnswer: q.user_answer,
        markedForReview: q.marked_for_review,
        timeSpent: q.time_spent_seconds,
      }))}
    />
  );
}
