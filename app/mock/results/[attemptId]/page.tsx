import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import Chick from "@/components/Chick";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ attemptId: string }> };

type AttemptRow = {
  id: string;
  user_id: string;
  mock_test_id: string;
  status: "in_progress" | "submitted" | "abandoned";
  score: number | null;
  total_correct: number | null;
  total_wrong: number | null;
  total_unattempted: number | null;
  total_time_seconds: number | null;
  sectional_breakdown:
    | Array<{
        name: string;
        correct: number;
        wrong: number;
        unattempted: number;
        score: number;
        time_seconds: number;
      }>
    | null;
  submitted_at: string | null;
};

type MockRow = {
  display_name: string;
  total_questions: number;
  positive_marks: number;
  negative_marks: number;
  duration_seconds: number;
};

type AnswerRow = {
  question_index: number;
  section_name: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: "A" | "B" | "C" | "D";
  user_answer: "A" | "B" | "C" | "D" | null;
  explanation: string | null;
  time_spent_seconds: number;
};

function fmtTime(seconds: number | null): string {
  if (!seconds || seconds < 0) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${s}s`;
}

/**
 * /mock/results/[attemptId] — sectional breakdown + per-question review.
 *
 * Three-zone layout:
 *   1. Headline score card (total score, max score, accuracy)
 *   2. Section table (correct / wrong / skipped / score / time)
 *   3. Full per-question review (collapsible later — for now flat list)
 */
export default async function MockResultsPage({ params }: PageProps) {
  const { attemptId } = await params;

  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: attempt } = await supabase
    .from("mock_attempts")
    .select(
      "id, user_id, mock_test_id, status, score, total_correct, total_wrong, total_unattempted, total_time_seconds, sectional_breakdown, submitted_at"
    )
    .eq("id", attemptId)
    .maybeSingle<AttemptRow>();

  if (!attempt || attempt.user_id !== user.id) redirect("/mock");
  if (attempt.status !== "submitted") redirect("/mock");

  const { data: mock } = await supabase
    .from("mock_tests")
    .select(
      "display_name, total_questions, positive_marks, negative_marks, duration_seconds"
    )
    .eq("id", attempt.mock_test_id)
    .maybeSingle<MockRow>();

  if (!mock) redirect("/mock");

  const { data: rows } = await supabase
    .from("mock_attempt_questions")
    .select(
      "question_index, section_name, question_text, option_a, option_b, option_c, option_d, correct_answer, user_answer, explanation, time_spent_seconds"
    )
    .eq("attempt_id", attemptId)
    .order("question_index", { ascending: true });

  const answers = (rows ?? []) as AnswerRow[];

  const maxScore = mock.total_questions * Number(mock.positive_marks);
  const accuracy = mock.total_questions
    ? Math.round(
        ((attempt.total_correct ?? 0) /
          Math.max(
            1,
            (attempt.total_correct ?? 0) + (attempt.total_wrong ?? 0)
          )) *
          100
      )
    : 0;

  const totalScore = Number(attempt.score ?? 0);
  const positive = totalScore >= maxScore * 0.5;

  return (
    <main className="min-h-screen bg-cream-50">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5 sm:px-8">
        <Link
          href="/mock"
          className="text-sm font-semibold text-cocoa-700 transition hover:text-cocoa-900"
        >
          ← Back to mocks
        </Link>
      </header>

      <section className="mx-auto max-w-5xl px-5 pb-16 sm:px-8">
        {/* Headline */}
        <div className="rounded-3xl border border-cocoa-900/[0.06] bg-gradient-to-br from-sun-400/20 via-sun-500/15 to-ember-500/15 p-6 text-center shadow-warm-lg sm:p-8">
          <Chick state={positive ? "excited" : "frustrated"} size={96} className="mx-auto" />
          <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-cocoa-500">
            {mock.display_name} · {attempt.submitted_at
              ? new Date(attempt.submitted_at).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })
              : ""}
          </p>
          <h1 className="mt-1 font-serif text-4xl font-bold text-cocoa-900 sm:text-5xl">
            {totalScore} / {maxScore}
          </h1>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Correct" value={attempt.total_correct ?? 0} good />
            <Stat label="Wrong" value={attempt.total_wrong ?? 0} bad />
            <Stat label="Skipped" value={attempt.total_unattempted ?? 0} />
            <Stat label="Accuracy" value={`${accuracy}%`} />
          </div>
          <p className="mt-4 text-xs text-cocoa-500">
            Total time used: {fmtTime(attempt.total_time_seconds)}
          </p>
        </div>

        {/* Sectional table */}
        {attempt.sectional_breakdown && attempt.sectional_breakdown.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-3 font-serif text-xl font-bold text-cocoa-900">
              Section-by-section
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-cocoa-900/[0.06] bg-cream-50 shadow-warm">
              <table className="min-w-full text-sm">
                <thead className="bg-cocoa-100 text-cocoa-700">
                  <tr>
                    <th className="p-3 text-left text-[10px] uppercase tracking-wider">Section</th>
                    <th className="p-3 text-right text-[10px] uppercase tracking-wider">Correct</th>
                    <th className="p-3 text-right text-[10px] uppercase tracking-wider">Wrong</th>
                    <th className="p-3 text-right text-[10px] uppercase tracking-wider">Skipped</th>
                    <th className="p-3 text-right text-[10px] uppercase tracking-wider">Score</th>
                    <th className="p-3 text-right text-[10px] uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {attempt.sectional_breakdown.map((s) => (
                    <tr key={s.name} className="border-t border-cocoa-900/[0.06]">
                      <td className="p-3 font-semibold text-cocoa-900">{s.name}</td>
                      <td className="p-3 text-right text-moss-700">{s.correct}</td>
                      <td className="p-3 text-right text-ember-700">{s.wrong}</td>
                      <td className="p-3 text-right text-cocoa-500">{s.unattempted}</td>
                      <td className="p-3 text-right font-semibold text-cocoa-900">{Number(s.score)}</td>
                      <td className="p-3 text-right tabular-nums text-cocoa-500">{fmtTime(s.time_seconds)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Per-question review */}
        <div className="mt-10">
          <h2 className="mb-3 font-serif text-xl font-bold text-cocoa-900">
            Every question, reviewed
          </h2>
          <p className="mb-4 text-sm text-cocoa-700">
            Your answer, the correct answer, and a one-line explanation for
            each question.
          </p>
          <ul className="space-y-3">
            {answers.map((a) => {
              const verdict = !a.user_answer
                ? "skipped"
                : a.user_answer === a.correct_answer
                ? "correct"
                : "wrong";
              return (
                <li
                  key={a.question_index}
                  className="rounded-2xl border border-cocoa-900/[0.06] bg-cream-50 p-4 shadow-warm sm:p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cocoa-500">
                        {a.section_name} · Q{a.question_index}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-cocoa-900">
                        {a.question_text}
                      </p>
                    </div>
                    <VerdictPill verdict={verdict} />
                  </div>
                  <div className="mt-3 grid gap-1.5 sm:grid-cols-2">
                    <OptionRow opt="A" text={a.option_a} isCorrect={a.correct_answer === "A"} isUser={a.user_answer === "A"} />
                    <OptionRow opt="B" text={a.option_b} isCorrect={a.correct_answer === "B"} isUser={a.user_answer === "B"} />
                    <OptionRow opt="C" text={a.option_c} isCorrect={a.correct_answer === "C"} isUser={a.user_answer === "C"} />
                    <OptionRow opt="D" text={a.option_d} isCorrect={a.correct_answer === "D"} isUser={a.user_answer === "D"} />
                  </div>
                  {a.explanation && (
                    <p className="mt-3 rounded-xl bg-cocoa-100 px-3 py-2 text-xs text-cocoa-700">
                      <span className="font-semibold text-cocoa-900">Why:</span>{" "}
                      {a.explanation}
                    </p>
                  )}
                  <p className="mt-2 text-[11px] text-cocoa-500">
                    Time on this question: {fmtTime(a.time_spent_seconds)}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/mock"
            className="inline-flex rounded-2xl bg-cocoa-900 px-5 py-2.5 text-sm font-bold text-cream-50"
          >
            Back to mocks
          </Link>
        </div>
      </section>
    </main>
  );
}

function Stat({
  label,
  value,
  good,
  bad,
}: {
  label: string;
  value: string | number;
  good?: boolean;
  bad?: boolean;
}) {
  const cls = good
    ? "bg-moss-500/15 text-moss-700"
    : bad
    ? "bg-ember-500/10 text-ember-700"
    : "bg-cocoa-100 text-cocoa-700";
  return (
    <div className={`rounded-2xl p-3 ${cls}`}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] opacity-80">
        {label}
      </p>
      <p className="mt-0.5 font-serif text-2xl font-bold">{value}</p>
    </div>
  );
}

function VerdictPill({
  verdict,
}: {
  verdict: "correct" | "wrong" | "skipped";
}) {
  if (verdict === "correct")
    return (
      <span className="rounded-full bg-moss-500/15 px-2.5 py-1 text-[10px] font-bold text-moss-700">
        Correct
      </span>
    );
  if (verdict === "wrong")
    return (
      <span className="rounded-full bg-ember-500/15 px-2.5 py-1 text-[10px] font-bold text-ember-700">
        Wrong
      </span>
    );
  return (
    <span className="rounded-full bg-cocoa-100 px-2.5 py-1 text-[10px] font-bold text-cocoa-700">
      Skipped
    </span>
  );
}

function OptionRow({
  opt,
  text,
  isCorrect,
  isUser,
}: {
  opt: "A" | "B" | "C" | "D";
  text: string;
  isCorrect: boolean;
  isUser: boolean;
}) {
  let cls = "border-cocoa-900/[0.06] text-cocoa-700";
  let badge = "";
  if (isCorrect) {
    cls = "border-moss-500/40 bg-moss-500/10 text-cocoa-900";
    badge = "✓ Correct";
  }
  if (isUser && !isCorrect) {
    cls = "border-ember-500/40 bg-ember-500/10 text-cocoa-900";
    badge = "Your answer";
  }
  if (isUser && isCorrect) {
    badge = "✓ Your answer";
  }
  return (
    <div className={`flex items-start gap-2 rounded-xl border px-3 py-2 text-xs ${cls}`}>
      <span className="font-bold">{opt}.</span>
      <span className="flex-1">{text}</span>
      {badge && <span className="ml-2 font-semibold">{badge}</span>}
    </div>
  );
}
