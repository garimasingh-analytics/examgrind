"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Chick from "@/components/Chick";
import UpgradeModal, { type PaywallReason } from "@/components/UpgradeModal";

type Props = {
  topicId: string;
  /** Server-side computed: how many free quizzes the user has left. */
  freeQuizzesLeft: number;
  /** Whether the user is on a paid plan (skips all gating). */
  isPaid: boolean;
};

const MIN = 5;
const MAX = 25;
const DEFAULT = 10;
const XP_PER_CORRECT = 10;

const LOADING_MESSAGES = [
  "Reading the textbook…",
  "Picking the right questions…",
  "Mixing in a few tricky ones…",
  "Polishing the wording…",
  "Setting up the quiz…",
];

export default function QuestionCountPicker({
  topicId,
  freeQuizzesLeft,
  isPaid,
}: Props) {
  const [count, setCount] = useState(DEFAULT);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [messageIdx, setMessageIdx] = useState(0);
  const [paywall, setPaywall] = useState<{
    reason: PaywallReason;
    used?: number;
    limit?: number;
  } | null>(null);
  const router = useRouter();

  // Free-tier gate state derived from props.
  const isBlocked = !isPaid && freeQuizzesLeft <= 0;

  // Cycle through loading messages while the API is generating questions.
  useEffect(() => {
    if (!pending) {
      setMessageIdx(0);
      return;
    }
    const t = setInterval(() => {
      setMessageIdx((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 1800);
    return () => clearInterval(t);
  }, [pending]);

  const start = () => {
    // Defensive: if the gate is hit, open the modal directly instead of
    // bouncing off the API.
    if (isBlocked) {
      setPaywall({ reason: "quiz-limit", used: 3, limit: 3 });
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/quiz/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topicId, questionCount: count }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          // Paywall (402)
          if (res.status === 402 && body?.paywall) {
            setPaywall({
              reason: (body.paywall.reason as PaywallReason) ?? "quiz-limit",
              used: body.paywall.used,
              limit: body.paywall.limit,
            });
            return;
          }
          // Friendly translations for known status codes
          if (res.status === 401) {
            throw new Error("Your session expired. Refresh the page and sign in again.");
          }
          if (res.status === 502) {
            throw new Error(
              "The question generator hiccupped. This usually clears up in a few seconds — try again."
            );
          }
          if (res.status >= 500) {
            throw new Error("Our server tripped over its feet. Try again in a moment.");
          }
          throw new Error(body.error ?? `Failed (${res.status})`);
        }
        const { quizId } = (await res.json()) as { quizId: string };
        router.push(`/quiz/${quizId}`);
      } catch (e: unknown) {
        let message: string;
        if (e instanceof TypeError) {
          // fetch() throws TypeError on network failure / offline
          message = "Couldn't reach the server. Check your internet and try again.";
        } else if (e instanceof Error) {
          message = e.message;
        } else {
          message = "Couldn't start the quiz.";
        }
        setError(message);
      }
    });
  };

  const maxXp = count * XP_PER_CORRECT;

  return (
    <>
      {pending && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-warm-wash backdrop-blur"
        >
          <Chick state="idle" size={200} />
          <div className="flex flex-col items-center gap-2 px-6 text-center">
            <h2 className="font-serif text-3xl font-semibold text-cocoa-900 sm:text-4xl">
              Crafting your quiz…
            </h2>
            <p className="text-base text-cocoa-700 transition-opacity duration-300">
              {LOADING_MESSAGES[messageIdx]}
            </p>
          </div>
          {/* Indeterminate sliding bar */}
          <div className="mt-2 h-1.5 w-72 overflow-hidden rounded-full bg-cream-200">
            <div className="h-full w-1/3 animate-quiz-loader rounded-full bg-gradient-to-r from-sun-500 to-ember-600" />
          </div>
        </div>
      )}

    <div className="rounded-3xl border border-cocoa-900/[0.08] bg-cream-50 p-7 shadow-warm-lg">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cocoa-500">
        How many questions?
      </p>

      <div className="mt-5 flex items-center justify-center gap-4">
        <button
          onClick={() => setCount(Math.max(MIN, count - 1))}
          disabled={count <= MIN || pending}
          className="flex size-12 items-center justify-center rounded-2xl border border-cocoa-900/[0.08] bg-white text-2xl font-bold text-cocoa-900 transition hover:border-cocoa-900/[0.2] hover:bg-cream-100 disabled:opacity-40"
          aria-label="Fewer questions"
        >
          −
        </button>
        <div className="flex min-w-[110px] flex-col items-center">
          <span className="font-serif text-6xl font-bold leading-none text-cocoa-900 tabular-nums">
            {count}
          </span>
          <span className="mt-1 text-xs font-medium uppercase tracking-widest text-cocoa-500">
            question{count === 1 ? "" : "s"}
          </span>
        </div>
        <button
          onClick={() => setCount(Math.min(MAX, count + 1))}
          disabled={count >= MAX || pending}
          className="flex size-12 items-center justify-center rounded-2xl border border-cocoa-900/[0.08] bg-white text-2xl font-bold text-cocoa-900 transition hover:border-cocoa-900/[0.2] hover:bg-cream-100 disabled:opacity-40"
          aria-label="More questions"
        >
          +
        </button>
      </div>

      {/* Native range slider, restyled */}
      <input
        type="range"
        min={MIN}
        max={MAX}
        step={1}
        value={count}
        onChange={(e) => setCount(parseInt(e.target.value, 10))}
        disabled={pending}
        className="mt-6 w-full appearance-none rounded-full bg-cream-200 accent-ember-600
                   [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none
                   [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-ember-600
                   [&::-webkit-slider-thumb]:shadow-warm h-2"
      />
      <div className="mt-2 flex justify-between text-[10px] font-mono text-cocoa-500">
        <span>{MIN}</span>
        <span>{MAX}</span>
      </div>

      <div className="mt-6 flex items-center justify-between rounded-2xl bg-sun-500/15 px-4 py-3">
        <span className="text-sm font-medium text-cocoa-700">Earn up to</span>
        <span className="font-serif text-xl font-bold text-cocoa-900 tabular-nums">
          {maxXp} XP
        </span>
      </div>

      {/* Free-tier indicator (hidden for paid users) */}
      {!isPaid && (
        <p className="mt-3 text-center text-[11px] font-medium text-cocoa-500">
          {freeQuizzesLeft > 0 ? (
            <>
              <span className="font-mono font-bold text-cocoa-700">
                {freeQuizzesLeft}
              </span>{" "}
              of <span className="font-mono">3</span> free quiz
              {freeQuizzesLeft === 1 ? "" : "zes"} left ·{" "}
              <button
                type="button"
                onClick={() => setPaywall({ reason: "manual" })}
                className="font-bold text-ember-700 underline-offset-2 hover:underline"
              >
                Upgrade
              </button>
            </>
          ) : (
            <>You&apos;ve used all 3 free quizzes.</>
          )}
        </p>
      )}

      {isBlocked ? (
        <button
          onClick={() => setPaywall({ reason: "quiz-limit", used: 3, limit: 3 })}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-sun-400 via-sun-500 to-ember-500 px-6 py-4 text-base font-bold text-cocoa-900 shadow-warm-lg transition hover:scale-[1.01] active:scale-[0.99]"
        >
          <span>👑</span>
          <span>Upgrade — ₹199 / month</span>
        </button>
      ) : (
        <button
          onClick={start}
          disabled={pending}
          className="mt-3 flex w-full items-center justify-center rounded-2xl bg-ember-600 px-6 py-4 text-base font-bold text-cream-50 shadow-warm-lg transition hover:bg-ember-700 active:scale-[0.99] disabled:opacity-60"
        >
          {pending ? "Preparing your quiz…" : "Start quiz"}
        </button>
      )}

      {error && (
        <div
          role="alert"
          className="mt-5 rounded-2xl border border-coral-500/30 bg-coral-500/5 p-5"
        >
          <div className="flex items-start gap-3">
            <Chick state="frustrated" size={56} />
            <div className="flex-1">
              <p className="font-serif text-base font-bold text-cocoa-900">
                Quiz didn&apos;t start
              </p>
              <p className="mt-1 text-sm text-cocoa-700">{error}</p>
              <button
                onClick={start}
                disabled={pending}
                className="mt-3 inline-flex items-center justify-center rounded-2xl bg-ember-600 px-4 py-2 text-xs font-bold text-cream-50 shadow-warm transition hover:bg-ember-700 disabled:opacity-60"
              >
                {pending ? "Retrying…" : "Try again"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

    <UpgradeModal
      open={!!paywall}
      onClose={() => setPaywall(null)}
      reason={paywall?.reason ?? "manual"}
      used={paywall?.used}
      limit={paywall?.limit}
    />
    </>
  );
}
