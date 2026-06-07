"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import CountdownTimer from "@/components/CountdownTimer";
import QuestionNavigator, {
  type NavQuestion,
} from "@/components/QuestionNavigator";

type Question = {
  index: number;
  sectionName: string;
  text: string;
  options: { A: string; B: string; C: string; D: string };
  userAnswer: "A" | "B" | "C" | "D" | null;
  markedForReview: boolean;
  timeSpent: number;
};

type Props = {
  attemptId: string;
  displayName: string;
  initialSecondsRemaining: number;
  questions: Question[];
};

/**
 * The timed-test client.
 *
 * State strategy:
 *   - Per-question state (answer / marked / visited / accumulated time)
 *     lives in a single `qs` array. We mutate the active question on
 *     navigate/answer and PATCH to the server.
 *   - The timer owns its own state in CountdownTimer; we listen to
 *     onExpire only.
 *   - We track when the user landed on the current question
 *     (`currentLandedAt`) to compute incremental time on navigate.
 *   - All server writes are fire-and-forget so the UI never blocks on
 *     latency. Failed writes log but don't surface to the student —
 *     the server is just a backup, the source of truth is in memory
 *     until submit.
 *
 * Strict mode behaviors:
 *   - Quit asks twice (confirm + 'this burns the attempt').
 *   - beforeunload warns on tab close.
 *   - Timer expire auto-submits.
 *   - No back nav out of the test.
 */
export default function MockTakeClient({
  attemptId,
  displayName,
  initialSecondsRemaining,
  questions,
}: Props) {
  const router = useRouter();
  const [qs, setQs] = useState<Question[]>(() =>
    questions.map((q) => ({ ...q }))
  );
  const [currentIndex, setCurrentIndex] = useState<number>(
    questions.find((q) => q.userAnswer === null)?.index ?? questions[0].index
  );
  const [visited, setVisited] = useState<Set<number>>(
    () => new Set(questions.filter((q) => q.userAnswer !== null).map((q) => q.index))
  );
  const [submitting, setSubmitting] = useState(false);
  const [confirmQuit, setConfirmQuit] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Track the wall-clock moment the user landed on the current
  // question so we can credit elapsed time on navigate / submit.
  const landedAtRef = useRef<number>(Date.now());

  // Mark the current question as visited the moment it renders.
  useEffect(() => {
    setVisited((prev) => {
      if (prev.has(currentIndex)) return prev;
      const next = new Set(prev);
      next.add(currentIndex);
      return next;
    });
  }, [currentIndex]);

  const currentQ = qs.find((q) => q.index === currentIndex)!;

  // ---- Server PATCH helpers ----
  const patchAnswer = useCallback(
    async (
      questionIndex: number,
      patch: {
        userAnswer?: "A" | "B" | "C" | "D" | null;
        timeSpentSeconds?: number;
        markedForReview?: boolean;
      }
    ) => {
      try {
        await fetch("/api/mock/answer", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ attemptId, questionIndex, ...patch }),
        });
      } catch {
        // Fire and forget — final submit reads server state, which we
        // sync continuously. If a PATCH drops the user can keep going.
      }
    },
    [attemptId]
  );

  // ---- Navigation ----
  const navigateTo = useCallback(
    (nextIndex: number) => {
      const elapsed = Math.max(
        0,
        Math.round((Date.now() - landedAtRef.current) / 1000)
      );
      if (elapsed > 0) {
        // Credit time to the question the user is leaving.
        setQs((prev) =>
          prev.map((q) =>
            q.index === currentIndex
              ? { ...q, timeSpent: q.timeSpent + elapsed }
              : q
          )
        );
        void patchAnswer(currentIndex, { timeSpentSeconds: elapsed });
      }
      landedAtRef.current = Date.now();
      setCurrentIndex(nextIndex);
    },
    [currentIndex, patchAnswer]
  );

  const selectAnswer = useCallback(
    (choice: "A" | "B" | "C" | "D") => {
      setQs((prev) =>
        prev.map((q) =>
          q.index === currentIndex ? { ...q, userAnswer: choice } : q
        )
      );
      void patchAnswer(currentIndex, { userAnswer: choice });
    },
    [currentIndex, patchAnswer]
  );

  const clearAnswer = useCallback(() => {
    setQs((prev) =>
      prev.map((q) =>
        q.index === currentIndex ? { ...q, userAnswer: null } : q
      )
    );
    void patchAnswer(currentIndex, { userAnswer: null });
  }, [currentIndex, patchAnswer]);

  const toggleMark = useCallback(() => {
    const next = !currentQ.markedForReview;
    setQs((prev) =>
      prev.map((q) =>
        q.index === currentIndex ? { ...q, markedForReview: next } : q
      )
    );
    void patchAnswer(currentIndex, { markedForReview: next });
  }, [currentIndex, currentQ.markedForReview, patchAnswer]);

  // ---- Submit / quit ----
  const submit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    // Credit final question's time before submit so the server reads
    // the right total.
    const elapsed = Math.max(
      0,
      Math.round((Date.now() - landedAtRef.current) / 1000)
    );
    if (elapsed > 0) {
      await patchAnswer(currentIndex, { timeSpentSeconds: elapsed });
    }
    try {
      const res = await fetch("/api/mock/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attemptId }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(body.error ?? "Couldn't submit.");
      router.push(`/mock/results/${attemptId}`);
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Couldn't submit.");
      setSubmitting(false);
    }
  }, [attemptId, currentIndex, patchAnswer, router, submitting]);

  const quit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await fetch("/api/mock/quit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attemptId }),
      });
    } finally {
      router.push("/mock");
    }
  }, [attemptId, router, submitting]);

  // ---- beforeunload warning ----
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (submitting) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [submitting]);

  // ---- Navigator data ----
  const navQuestions: NavQuestion[] = qs.map((q) => ({
    index: q.index,
    sectionName: q.sectionName,
    answered: q.userAnswer !== null,
    markedForReview: q.markedForReview,
    visited: visited.has(q.index),
  }));

  const isLast = currentIndex === qs[qs.length - 1].index;

  return (
    <main className="min-h-screen bg-cream-50">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-cocoa-900/[0.08] bg-cream-50/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <p className="truncate font-serif text-sm font-bold text-cocoa-900 sm:text-base">
              {displayName}
            </p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-cocoa-500">
              Q {currentIndex} of {qs.length}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <CountdownTimer
              initialSeconds={initialSecondsRemaining}
              onExpire={() => void submit()}
            />
            <button
              type="button"
              onClick={() => setConfirmQuit(true)}
              className="rounded-2xl border border-cocoa-900/[0.1] px-3 py-2 text-xs font-semibold text-cocoa-700 transition hover:bg-cocoa-100"
            >
              Quit
            </button>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_280px]">
        {/* Question column */}
        <section>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cocoa-500">
            {currentQ.sectionName}
          </p>
          <h2 className="mt-2 font-serif text-xl font-bold leading-snug text-cocoa-900 sm:text-2xl">
            {currentQ.text}
          </h2>

          <div className="mt-5 space-y-2.5">
            {(["A", "B", "C", "D"] as const).map((opt) => {
              const selected = currentQ.userAnswer === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => selectAnswer(opt)}
                  className={[
                    "flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left transition",
                    selected
                      ? "border-cocoa-900 bg-cocoa-900 text-cream-50"
                      : "border-cocoa-900/[0.08] bg-cream-50 text-cocoa-900 hover:border-cocoa-900/[0.3]",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
                      selected
                        ? "bg-cream-50 text-cocoa-900"
                        : "bg-cocoa-100 text-cocoa-700",
                    ].join(" ")}
                  >
                    {opt}
                  </span>
                  <span className="text-sm">{currentQ.options[opt]}</span>
                </button>
              );
            })}
          </div>

          {/* Action bar */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={toggleMark}
              className={[
                "rounded-2xl px-4 py-2 text-xs font-semibold transition",
                currentQ.markedForReview
                  ? "bg-ember-600 text-cream-50"
                  : "border border-cocoa-900/[0.1] text-cocoa-700 hover:bg-cocoa-100",
              ].join(" ")}
            >
              {currentQ.markedForReview
                ? "✓ Marked for review"
                : "Mark for review"}
            </button>
            {currentQ.userAnswer !== null && (
              <button
                type="button"
                onClick={clearAnswer}
                className="rounded-2xl border border-cocoa-900/[0.1] px-4 py-2 text-xs font-semibold text-cocoa-700 transition hover:bg-cocoa-100"
              >
                Clear response
              </button>
            )}
            <div className="ml-auto flex gap-2">
              <button
                type="button"
                onClick={() => navigateTo(Math.max(1, currentIndex - 1))}
                disabled={currentIndex === 1}
                className="rounded-2xl border border-cocoa-900/[0.1] px-4 py-2 text-xs font-semibold text-cocoa-700 transition hover:bg-cocoa-100 disabled:opacity-40"
              >
                ← Previous
              </button>
              {isLast ? (
                <button
                  type="button"
                  onClick={() => void submit()}
                  disabled={submitting}
                  className="rounded-2xl bg-gradient-to-br from-sun-400 via-sun-500 to-ember-500 px-5 py-2 text-xs font-bold text-cocoa-900 shadow-warm transition hover:scale-[1.02] disabled:opacity-60"
                >
                  Submit mock →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => navigateTo(currentIndex + 1)}
                  className="rounded-2xl bg-cocoa-900 px-4 py-2 text-xs font-semibold text-cream-50 transition hover:bg-cocoa-700"
                >
                  Save & Next →
                </button>
              )}
            </div>
          </div>

          {submitError && (
            <p
              role="alert"
              className="mt-4 rounded-xl bg-ember-600/10 px-4 py-2.5 text-center text-xs font-medium text-ember-700"
            >
              {submitError}
            </p>
          )}
        </section>

        {/* Navigator column */}
        <aside className="rounded-2xl border border-cocoa-900/[0.06] bg-cream-50 p-4 shadow-warm lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
          <QuestionNavigator
            questions={navQuestions}
            currentIndex={currentIndex}
            onSelect={navigateTo}
          />
        </aside>
      </div>

      {/* Quit confirm modal */}
      {confirmQuit && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-cocoa-900/40 px-4"
          onClick={() => setConfirmQuit(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-cocoa-900/[0.06] bg-cream-50 p-6 shadow-warm-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-serif text-2xl font-bold text-cocoa-900">
              Quit the mock?
            </h3>
            <p className="mt-2 text-sm text-cocoa-700">
              This will <strong>end the attempt for good</strong>. You can&apos;t
              resume, and it counts as your free mock. To practice again
              you&apos;ll have to start a brand new mock from scratch.
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setConfirmQuit(false)}
                className="rounded-2xl border border-cocoa-900/[0.1] px-4 py-2 text-sm font-semibold text-cocoa-700 transition hover:bg-cocoa-100"
              >
                Keep going
              </button>
              <button
                type="button"
                onClick={() => void quit()}
                disabled={submitting}
                className="rounded-2xl bg-ember-600 px-4 py-2 text-sm font-bold text-cream-50 transition hover:bg-ember-700 disabled:opacity-60"
              >
                {submitting ? "Quitting…" : "Quit and burn the attempt"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
