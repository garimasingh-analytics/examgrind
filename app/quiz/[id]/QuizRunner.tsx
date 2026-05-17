"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Chick from "@/components/Chick";

type Letter = "A" | "B" | "C" | "D";

type ClientQuestion = {
  id: string;
  question: string;
  A: string;
  B: string;
  C: string;
  D: string;
};

type Props = {
  quizId: string;
  topicLabel: string;
  questions: ClientQuestion[];
};

/**
 * IMPORTANT: this component does NOT know which answer is correct.
 * That comes back from the server when we submit. Until submission,
 * the chick stays in "idle" state — no fake feedback.
 *
 * The "yay/sad" reactions land on the RESULTS screen, with the chick
 * playing one final state per question for review.
 *
 * (We can revisit later — show per-answer feedback inline if desired —
 *  but that requires sending correct answers to the client, which lets
 *  users cheat by inspecting the DOM.)
 */
export default function QuizRunner({ quizId, topicLabel, questions }: Props) {
  const router = useRouter();
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Letter | null>>({});
  const [times, setTimes] = useState<Record<string, number>>({});
  const [questionStart, setQuestionStart] = useState<number>(Date.now());
  const [submitting, startSubmit] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // ---- Behavioural signals for the chick mascot ---------------------
  // We never know what the correct answer is on the client (anti-cheat),
  // so the chick can only react to *how the user behaves* — not to their
  // accuracy. The chick gets frustrated when:
  //   - the user skips 2 questions in a row (struggling), OR
  //   - the user has been staring at the current question for 45+ seconds
  //     without selecting anything.
  const [skipStreak, setSkipStreak] = useState(0);
  const [secondsOnQuestion, setSecondsOnQuestion] = useState(0);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);

  // Has the user invested anything yet? (At least one selected answer.)
  const hasProgress = useMemo(
    () => Object.values(answers).some((v) => v != null),
    [answers]
  );

  // beforeunload guard: prompt the browser confirm dialog if the user tries
  // to close the tab, hit refresh, or navigate away while answers exist.
  // Disabled while submitting (the redirect to /results is intentional).
  useEffect(() => {
    if (!hasProgress || submitting) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // Modern browsers ignore the message and show their own prompt, but
      // returnValue must be set to trigger the dialog at all.
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [hasProgress, submitting]);

  // Reset the question timer whenever idx changes.
  useEffect(() => {
    setQuestionStart(Date.now());
    setSecondsOnQuestion(0);
  }, [idx]);

  // Tick once per second while the question is open so the chick reacts live.
  useEffect(() => {
    const t = setInterval(() => {
      setSecondsOnQuestion((s) => s + 1);
    }, 1000);
    return () => clearInterval(t);
  }, [idx]);

  const total = questions.length;
  const current = questions[idx];
  const selected = answers[current.id] ?? null;
  const answeredCount = Object.values(answers).filter((v) => v != null).length;
  const progressPct = ((idx + 1) / total) * 100;

  // Frustrated trigger: stuck >45s without picking, OR 2+ skips in a row.
  // The selection of an option immediately calms them back to idle.
  const chickState: "idle" | "frustrated" =
    selected == null && (skipStreak >= 2 || secondsOnQuestion >= 45)
      ? "frustrated"
      : "idle";

  const choose = (letter: Letter) => {
    if (submitting) return;
    setAnswers((prev) => ({ ...prev, [current.id]: letter }));
  };

  const nextOrSubmit = () => {
    // Record time spent on this question
    const elapsed = Math.round((Date.now() - questionStart) / 1000);
    setTimes((t) => ({ ...t, [current.id]: elapsed }));

    // Update skip streak: skipped if no answer was selected
    const skipped = answers[current.id] == null;
    setSkipStreak((s) => (skipped ? s + 1 : 0));

    if (idx < total - 1) {
      setIdx(idx + 1);
      return;
    }
    // Last question → submit
    submit({ ...times, [current.id]: elapsed });
  };

  const submit = (finalTimes: Record<string, number>) => {
    setError(null);
    startSubmit(async () => {
      try {
        const res = await fetch("/api/quiz/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quizId, answers, times: finalTimes }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? `Failed (${res.status})`);
        }
        router.push(`/results/${quizId}`);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Couldn't submit.";
        setError(message);
      }
    });
  };

  const requestQuit = () => {
    if (!hasProgress) {
      // Nothing to lose — just bail back home.
      router.push("/home");
      return;
    }
    setShowQuitConfirm(true);
  };
  const confirmQuit = () => router.push("/home");
  const cancelQuit = () => setShowQuitConfirm(false);

  const optionLetters: Letter[] = ["A", "B", "C", "D"];

  return (
    <main className="bg-warm-wash min-h-[100svh] pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-cocoa-900/[0.04] bg-cream-100/85 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <button
            onClick={requestQuit}
            className="flex min-w-0 flex-1 flex-col items-start text-left transition hover:opacity-80"
            aria-label="Quit quiz"
          >
            <span className="w-full truncate text-[10px] font-semibold uppercase tracking-[0.2em] text-cocoa-500">
              ← {topicLabel}
            </span>
            <span className="font-mono text-xs text-cocoa-700">
              Question {idx + 1} of {total}
            </span>
          </button>
          <Chick state={chickState} size={56} />
        </div>
        {/* Progress bar */}
        <div className="h-1.5 w-full bg-cream-200">
          <div
            className="h-full bg-gradient-to-r from-sun-500 to-ember-600 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </header>

      <section className="mx-auto max-w-2xl px-6 pt-10">
        {/* Question */}
        <h1 className="font-serif text-2xl font-semibold leading-snug text-cocoa-900 sm:text-3xl">
          {current.question}
        </h1>

        {/* Options */}
        <ul className="mt-8 space-y-3">
          {optionLetters.map((L) => {
            const isSelected = selected === L;
            return (
              <li key={L}>
                <button
                  onClick={() => choose(L)}
                  disabled={submitting}
                  className={[
                    "flex w-full items-start gap-4 rounded-2xl border-2 px-5 py-4 text-left transition",
                    "shadow-warm",
                    isSelected
                      ? "border-ember-600 bg-ember-600/5"
                      : "border-cocoa-900/[0.06] bg-cream-50 hover:border-cocoa-900/[0.18] hover:bg-white",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "flex size-9 shrink-0 items-center justify-center rounded-xl font-serif text-base font-bold",
                      isSelected
                        ? "bg-ember-600 text-cream-50"
                        : "bg-cream-200 text-cocoa-700",
                    ].join(" ")}
                  >
                    {L}
                  </span>
                  <span className="pt-1.5 text-base leading-snug text-cocoa-900">
                    {current[L]}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Action row */}
        <div className="mt-10 flex items-center justify-between gap-3">
          <button
            onClick={() => idx > 0 && setIdx(idx - 1)}
            disabled={idx === 0 || submitting}
            className="shrink-0 text-sm font-medium text-cocoa-500 hover:text-cocoa-900 disabled:opacity-40"
          >
            ← Previous
          </button>

          {/* Counter — hide on the smallest screens to keep the row uncrowded */}
          <span className="hidden font-mono text-xs text-cocoa-500 sm:inline">
            {answeredCount} / {total} answered
          </span>

          <button
            onClick={nextOrSubmit}
            disabled={submitting}
            className={[
              "inline-flex shrink-0 items-center justify-center rounded-2xl px-5 py-3 text-sm font-bold shadow-warm transition sm:px-6",
              selected
                ? "bg-ember-600 text-cream-50 hover:bg-ember-700"
                : "bg-cocoa-900/10 text-cocoa-500",
            ].join(" ")}
          >
            {submitting
              ? "Submitting…"
              : idx === total - 1
              ? "Finish"
              : selected
              ? "Next →"
              : "Skip →"}
          </button>
        </div>

        {error && (
          <p className="mt-6 text-center text-sm text-coral-500" role="alert">
            {error}
          </p>
        )}
      </section>

      {/* Quit-confirm modal */}
      {showQuitConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="quit-quiz-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-cocoa-900/40 px-6"
          onClick={cancelQuit}
        >
          <div
            className="w-full max-w-sm rounded-3xl border border-cocoa-900/[0.06] bg-cream-50 p-6 shadow-warm-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center">
              <Chick state="sad" size={96} />
              <h2
                id="quit-quiz-title"
                className="mt-3 font-serif text-2xl font-bold text-cocoa-900"
              >
                Leave the quiz?
              </h2>
              <p className="mt-2 text-sm text-cocoa-700">
                Your answers so far won&apos;t be saved. You can always start
                this topic again from scratch.
              </p>
            </div>
            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={confirmQuit}
                className="rounded-2xl bg-coral-500 px-5 py-3 text-sm font-bold text-cream-50 transition hover:bg-coral-500/90"
              >
                Quit quiz
              </button>
              <button
                onClick={cancelQuit}
                className="rounded-2xl border-2 border-cocoa-900/[0.08] bg-cream-50 px-5 py-3 text-sm font-bold text-cocoa-900 transition hover:border-cocoa-900/[0.18] hover:bg-white"
              >
                Keep going
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
