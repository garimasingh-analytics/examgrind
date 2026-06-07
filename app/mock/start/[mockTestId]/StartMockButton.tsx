"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Chick from "@/components/Chick";
import UpgradeModal, { type PaywallReason } from "@/components/UpgradeModal";

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
  const [error, setError] = useState<string | null>(null);
  const [paywall, setPaywall] = useState<null | {
    reason: PaywallReason;
    used?: number;
    limit?: number;
  }>(null);

  const start = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/mock/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mockTestId }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        attemptId?: string;
        error?: string;
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
      if (!res.ok || !body.attemptId) {
        throw new Error(body.error ?? "Couldn't start the mock.");
      }
      router.push(`/mock/take/${body.attemptId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={start}
        disabled={loading}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-sun-400 via-sun-500 to-ember-500 px-6 py-4 text-base font-bold text-cocoa-900 shadow-warm-lg transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Generating your mock…" : "I'm ready — Start the mock"}
      </button>
      {error && (
        <p
          role="alert"
          className="mt-3 rounded-xl bg-ember-600/10 px-4 py-2.5 text-center text-xs font-medium text-ember-700"
        >
          {error}
        </p>
      )}

      {loading && (
        // Full-screen loading overlay — the question generation takes
        // 8-15 seconds for a 180q NEET mock. Need a clear "we're working".
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-4 bg-cream-50/95 px-4 text-center">
          <Chick state="idle" size={120} />
          <h2 className="font-serif text-2xl font-bold text-cocoa-900">
            Generating your mock…
          </h2>
          <p className="max-w-xs text-sm text-cocoa-700">
            We&apos;re writing every question fresh for you. This usually
            takes 10-15 seconds.
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
