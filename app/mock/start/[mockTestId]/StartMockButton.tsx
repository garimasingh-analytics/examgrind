"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Chick from "@/components/Chick";
import UpgradeModal, { type PaywallReason } from "@/components/UpgradeModal";
import { trackMockStarted } from "@/lib/product-analytics";
import type { MockDifficulty } from "@/lib/mock-question-identity";

const DIFFICULTY_OPTIONS: Array<{
  value: MockDifficulty;
  label: string;
  description: string;
}> = [
  { value: "easy", label: "Easy", description: "Build confidence" },
  { value: "medium", label: "Medium", description: "Exam-level" },
  { value: "hard", label: "Difficult", description: "Push yourself" },
];

// Normal starts complete in one request. These are only for an interrupted
// network/server response; the API performs its own deeper provider retries
// before returning one of these retryable responses.
const AUTO_RECOVERY_DELAYS = [0, 1_500, 4_000];
const RETRYABLE_STATUSES = new Set([429, 500, 502, 503, 504]);

const pause = (milliseconds: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds));

/**
 * Calls POST /api/mock/start. On success → push to /mock/take/[id].
 * On 402 → open UpgradeModal with mock-limit reason.
 *
 * The button shows a loading overlay because question generation takes
 * 8-15 seconds — the student needs to know we're working.
 */
export default function StartMockButton({ mockTestId }: { mockTestId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [difficulty, setDifficulty] = useState<MockDifficulty>("medium");
  const [error, setError] = useState<string | null>(null);
  const [recoveryAttempt, setRecoveryAttempt] = useState(0);
  const [paywall, setPaywall] = useState<null | {
    reason: PaywallReason;
    used?: number;
    limit?: number;
  }>(null);

  const start = async () => {
    setError(null);
    setRecoveryAttempt(0);
    setLoading(true);
    for (let attempt = 0; attempt < AUTO_RECOVERY_DELAYS.length; attempt += 1) {
      if (attempt > 0) {
        setRecoveryAttempt(attempt);
        await pause(AUTO_RECOVERY_DELAYS[attempt]);
      }

      try {
        const res = await fetch("/api/mock/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mockTestId, difficulty }),
        });
        const body = (await res.json().catch(() => ({}))) as {
          attemptId?: string;
          error?: string;
          retryable?: boolean;
          paywall?: {
            reason?: PaywallReason;
            used?: number;
            limit?: number;
          };
        };

        if (res.status === 402 && body.paywall) {
          setLoading(false);
          setPaywall({
            reason: body.paywall.reason ?? "mock-limit",
            used: body.paywall.used,
            limit: body.paywall.limit,
          });
          return;
        }
        if (res.ok && body.attemptId) {
          trackMockStarted({ mock_test_id: mockTestId, difficulty });
          router.push(`/mock/take/${body.attemptId}`);
          return;
        }

        const retryable = body.retryable === true || RETRYABLE_STATUSES.has(res.status);
        if (!retryable) {
          setError(body.error ?? "We couldn't start this mock. Please try again.");
          setLoading(false);
          return;
        }
      } catch {
        // A browser-level network interruption is just as recoverable as a
        // provider hiccup. Stay on the flow and let the automatic recovery
        // path make the next attempt rather than dumping an error toast.
      }
    }

    // This state is deliberately neutral rather than a raw server error.
    // The test is never started partially; a single click keeps retrying with
    // the same difficulty once the connection has recovered.
    setError(
      "Your fresh mock is taking longer than usual. Nothing has been started halfway — tap Continue and we’ll keep preparing it."
    );
    setLoading(false);
  };

  return (
    <>
      <section className="mt-6 rounded-2xl border border-cocoa-900/[0.08] bg-cream-50 p-4 shadow-warm sm:p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-1.5">
          <h2 className="text-sm font-bold text-cocoa-900">Choose your difficulty</h2>
          <p className="text-xs text-cocoa-600">Every question is checked against your earlier mocks.</p>
        </div>
        <div
          role="radiogroup"
          aria-label="Mock difficulty"
          className="mt-3 grid grid-cols-3 gap-2"
        >
          {DIFFICULTY_OPTIONS.map((option) => {
            const selected = difficulty === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={selected}
                disabled={loading}
                onClick={() => setDifficulty(option.value)}
                className={`rounded-xl border px-2 py-3 text-center transition focus:outline-none focus:ring-2 focus:ring-sun-400 focus:ring-offset-2 disabled:cursor-not-allowed ${
                  selected
                    ? "border-cocoa-900 bg-cocoa-900 text-cream-50 shadow-warm"
                    : "border-cocoa-900/[0.12] bg-cream-100 text-cocoa-800 hover:border-cocoa-900/30 hover:bg-cream-50"
                }`}
              >
                <span className="block text-sm font-bold">{option.label}</span>
                <span className={`mt-0.5 block text-[10px] ${selected ? "text-cream-50/75" : "text-cocoa-500"}`}>
                  {option.description}
                </span>
              </button>
            );
          })}
        </div>
      </section>
      <button
        type="button"
        onClick={start}
        disabled={loading}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sun-400 px-6 py-4 text-base font-bold text-cocoa-900 shadow-warm-lg transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Generating your mock…" : `Start ${DIFFICULTY_OPTIONS.find((option) => option.value === difficulty)?.label} mock`}
      </button>
      {error && (
        <div
          role="status"
          className="mt-3 flex flex-col items-center gap-2 rounded-xl border border-cocoa-900/[0.10] bg-cream-50 px-4 py-3 text-center"
        >
          <p className="text-xs font-medium text-cocoa-700">{error}</p>
          <button
            type="button"
            onClick={start}
            className="rounded-lg bg-cocoa-900 px-3 py-1.5 text-xs font-bold text-cream-50 transition hover:bg-cocoa-800"
          >
            Continue preparing
          </button>
        </div>
      )}

      {loading && (
        // Full-screen loading overlay — the question generation takes
        // 8-15 seconds for a 180q NEET mock. Need a clear "we're working".
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-4 bg-cream-50/95 px-4 text-center">
          <Chick state="idle" size={120} />
          <h2 className="font-serif text-2xl font-bold text-cocoa-900">
            {recoveryAttempt ? "Still preparing your mock…" : "Generating your mock…"}
          </h2>
          <p className="max-w-xs text-sm text-cocoa-700">
            {recoveryAttempt
              ? "We hit a brief connection bump and are retrying automatically. Your mock will stay fresh."
              : "We’re writing a fresh set and checking it against your earlier mocks. This usually takes 10–20 seconds."}
          </p>
        </div>
      )}

      <UpgradeModal
        open={!!paywall}
        onClose={() => setPaywall(null)}
        reason={paywall?.reason ?? "mock-limit"}
        used={paywall?.used}
        limit={paywall?.limit}
      />
    </>
  );
}
