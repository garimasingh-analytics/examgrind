import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import Chick from "@/components/Chick";
import ExamSwitcher from "@/components/ExamSwitcher";
import PremiumBadge from "@/components/PremiumBadge";
import DeepAnalysis, { type AnalysisJson } from "./DeepAnalysis";
import ShareButton from "./ShareButton";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export default async function ResultsPage({ params }: Params) {
  const { id } = await params;
  const supabase = createServerSupabase();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: quizRow } = await supabase
    .from("quizzes")
    .select("id, user_id, score, xp_awarded, subject, subtopic, chapter_id, topic_id")
    .eq("id", id)
    .maybeSingle();
  if (!quizRow) notFound();
  if (quizRow.user_id !== user.id) redirect("/home");
  if (quizRow.score == null) redirect(`/quiz/${id}`);

  const { data: questionsData } = await supabase
    .from("questions")
    .select("id, question_text, option_a, option_b, option_c, option_d, correct_answer, user_answer, time_taken, explanation")
    .eq("quiz_id", id)
    .order("created_at", { ascending: true });
  const questions = questionsData ?? [];

  const total = questions.length;
  const correct = quizRow.score;
  const xp = quizRow.xp_awarded ?? 0;
  // "Empty quiz" = user skipped every question. We don't punish with a sad
  // chick / 0% sting — just show a neutral state and an easy way back in.
  const answered = questions.filter((q) => q.user_answer != null).length;
  const isEmpty = answered === 0;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  const completed = !isEmpty && accuracy >= 70;

  // Pull current streak so we can flash a celebration if it's > 0.
  // Also pulls subscription tier + analyses_taken for the deep analysis quota.
  const { data: profile } = await supabase
    .from("users")
    .select("streak_count, last_active_date, subscription_status, analyses_taken, exam_choice")
    .eq("id", user.id)
    .maybeSingle<{
      streak_count: number;
      last_active_date: string | null;
      subscription_status: "free" | "trial" | "paid";
      analyses_taken: number;
      exam_choice: string | null;
    }>();
  const examSlug = profile?.exam_choice ?? "cuet";

  // Existing analysis for this quiz (if already generated)
  const { data: existingAnalysis } = await supabase
    .from("quiz_analyses")
    .select("analysis, is_deep_dive")
    .eq("quiz_id", id)
    .maybeSingle<{ analysis: AnalysisJson; is_deep_dive: boolean }>();

  const isPaid = profile?.subscription_status === "paid";
  const freeAnalysisUsed = (profile?.analyses_taken ?? 0) >= 1;
  const today = new Date().toISOString().slice(0, 10);
  const streakActiveToday =
    profile?.last_active_date === today && (profile?.streak_count ?? 0) > 0;
  const streak = streakActiveToday ? profile?.streak_count ?? 0 : 0;

  // Chick reacts based on accuracy (or stays neutral if the user skipped all)
  const chickState: "excited" | "happy" | "idle" | "sad" =
    isEmpty            ? "idle"
  : accuracy >= 90     ? "excited"
  : accuracy >= 70     ? "happy"
  : accuracy >= 40     ? "idle"
  :                      "sad";

  const headline =
    isEmpty            ? "No answers this round."
  : accuracy >= 90     ? "You aced it."
  : accuracy >= 70     ? "Nicely done."
  : accuracy >= 40     ? "Good attempt — let's keep building."
  :                      "Tough one. We'll come back stronger.";

  const subhead = isEmpty
    ? "Every question was skipped — give it another go when you're ready."
    : null;

  return (
    <main className="bg-warm-wash min-h-[100svh] pb-24">
      <header className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/home" className="font-serif text-lg font-bold text-cocoa-900 sm:text-xl">
            ExamGrind
          </Link>
          <ExamSwitcher currentSlug={examSlug} />
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <PremiumBadge isPaid={isPaid} />
          <Link href="/home" className="text-sm font-medium text-cocoa-500 hover:text-cocoa-900">
            Home
          </Link>
        </div>
      </header>

      {/* Score panel */}
      <section className="mx-auto max-w-2xl px-4 pt-4 sm:px-6 sm:pt-8">
        <div className="rounded-4xl border border-cocoa-900/[0.06] bg-cream-50 p-6 shadow-warm-lg sm:p-10">
          <div className="flex flex-col items-center text-center">
            <Chick state={chickState} size={140} />
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-cocoa-500">
              {quizRow.subject} · {quizRow.subtopic}
            </p>
            <h1 className="mt-2 font-serif text-4xl font-semibold leading-tight text-cocoa-900 sm:text-5xl">
              {headline}
            </h1>
            {subhead && (
              <p className="mt-3 max-w-md text-sm text-cocoa-700">{subhead}</p>
            )}
          </div>

          {!isEmpty && (
            <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-3">
              <Stat label="Correct" value={`${correct} / ${total}`} />
              <Stat label="Accuracy" value={`${accuracy}%`} accent="text-ember-600" />
              <Stat label="XP earned" value={`+${xp}`} accent="text-sun-600" />
            </div>
          )}

          {completed && (
            <div className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-sun-500/15 px-4 py-3 text-sm font-semibold text-cocoa-900">
              <span>🎉</span>
              <span>Topic completed — the next one is unlocked.</span>
            </div>
          )}

          {!isEmpty && streak > 0 && (
            <div className="mt-3 flex items-center justify-center gap-2 rounded-2xl bg-ember-600/10 px-4 py-3 text-sm font-semibold text-ember-700">
              <span>🔥</span>
              <span>
                {streak === 1
                  ? "Streak started — come back tomorrow to keep it going."
                  : `${streak}-day streak — keep it lit.`}
              </span>
            </div>
          )}

          {/* Share button — only when there's actually a score to share */}
          {!isEmpty && (
            <div className="mt-6 flex justify-center">
              <ShareButton
                quizId={id}
                scoreLabel={`${correct}/${total}`}
                topic={quizRow.subtopic ?? quizRow.subject}
                accuracy={accuracy}
              />
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {quizRow.chapter_id && (
              <Link
                href={`/chapter/${quizRow.chapter_id}`}
                className="inline-flex items-center justify-center rounded-2xl bg-ember-600 px-6 py-3 text-sm font-bold text-cream-50 shadow-warm transition hover:bg-ember-700"
              >
                Back to chapter
              </Link>
            )}
            {quizRow.topic_id && (
              <Link
                href={`/topic/${quizRow.topic_id}`}
                className="inline-flex items-center justify-center rounded-2xl border-2 border-cocoa-900/[0.08] bg-cream-50 px-6 py-3 text-sm font-bold text-cocoa-900 transition hover:border-cocoa-900/[0.2] hover:bg-white"
              >
                Try again
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Deep Analysis — only for non-empty quizzes */}
      {!isEmpty && (
        <section className="mx-auto mt-10 max-w-2xl px-4 sm:px-6">
          <DeepAnalysis
            quizId={id}
            topicId={quizRow.topic_id}
            initialAnalysis={existingAnalysis?.analysis ?? null}
            initialIsDeepDive={existingAnalysis?.is_deep_dive ?? false}
            freeAnalysisUsed={freeAnalysisUsed}
            isPaid={isPaid}
          />
        </section>
      )}

      {/* Per-question review */}
      <section className="mx-auto mt-10 max-w-2xl px-4 sm:px-6">
        <h2 className="mb-4 font-serif text-xl font-bold text-cocoa-900">
          Review
        </h2>
        <ol className="space-y-4">
          {questions.map((q, i) => {
            const userLetter = q.user_answer as "A" | "B" | "C" | "D" | null;
            const correctLetter = q.correct_answer as "A" | "B" | "C" | "D";
            const wasRight = userLetter === correctLetter;
            const skipped = userLetter == null;

            const optionFor = (L: "A" | "B" | "C" | "D") =>
              ({ A: q.option_a, B: q.option_b, C: q.option_c, D: q.option_d }[L]);

            return (
              <li
                key={q.id}
                className="rounded-3xl border border-cocoa-900/[0.06] bg-cream-50 p-5 shadow-warm"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={[
                      "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                      wasRight
                        ? "bg-moss-500 text-cream-50"
                        : skipped
                        ? "bg-cream-200 text-cocoa-500"
                        : "bg-coral-500 text-cream-50",
                    ].join(" ")}
                  >
                    {wasRight ? "✓" : skipped ? "—" : "✗"}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-cocoa-900">
                      <span className="font-mono text-xs text-cocoa-500">{i + 1}.</span>{" "}
                      {q.question_text}
                    </p>

                    <div className="mt-3 space-y-1.5 text-sm">
                      <p className="text-cocoa-700">
                        <span className="font-mono text-xs text-cocoa-500">Correct:</span>{" "}
                        <span className="font-semibold text-moss-500">{correctLetter}</span> · {optionFor(correctLetter)}
                      </p>
                      {!wasRight && !skipped && userLetter && (
                        <p className="text-cocoa-700">
                          <span className="font-mono text-xs text-cocoa-500">Your answer:</span>{" "}
                          <span className="font-semibold text-coral-500">{userLetter}</span> · {optionFor(userLetter)}
                        </p>
                      )}
                      {skipped && (
                        <p className="text-cocoa-500 italic">Skipped</p>
                      )}
                    </div>

                    {/* Per-question explanation. Populated by the quiz/start
                        prompt going forward. Older quizzes with null
                        explanation just hide this block — no broken UI. */}
                    {q.explanation && (
                      <div className="mt-3 rounded-2xl bg-cocoa-100 px-3.5 py-2.5">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cocoa-500">
                          Why
                        </p>
                        <p className="mt-1 text-sm text-cocoa-900">
                          {q.explanation}
                        </p>
                      </div>
                    )}

                    {/* Per-question time used. Subtle — small, muted. */}
                    {typeof q.time_taken === "number" && q.time_taken > 0 && (
                      <p className="mt-2 text-[11px] text-cocoa-500">
                        ⏱ {q.time_taken < 60
                          ? `${q.time_taken}s`
                          : `${Math.floor(q.time_taken / 60)}m ${q.time_taken % 60}s`}{" "}
                        on this question
                      </p>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </main>
  );
}

function Stat({
  label,
  value,
  accent = "text-cocoa-900",
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl border border-cocoa-900/[0.06] bg-cream-100 p-4 text-center">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-cocoa-500">
        {label}
      </p>
      <p className={`mt-1 font-serif text-2xl font-bold tabular-nums ${accent}`}>
        {value}
      </p>
    </div>
  );
}
