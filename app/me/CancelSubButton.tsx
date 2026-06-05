"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

/**
 * Cancel-subscription control on /me.
 *
 * Two-step UX: first click expands a confirm box, second click fires
 * the API. Prevents an accidental "I tapped that by mistake" moment.
 *
 * The API uses cancel_at_cycle_end=true, so the user keeps access
 * through the cycle they already paid for — we tell them that
 * explicitly so they don't expect an immediate downgrade.
 */
export default function CancelSubButton({
  paidUntil,
}: {
  paidUntil: string | null;
}) {
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const cancel = () => {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/billing/cancel-subscription", {
          method: "POST",
        });
        if (!res.ok) {
          const body = (await res.json().catch(() => ({}))) as {
            error?: string;
          };
          throw new Error(body.error ?? "Couldn't cancel.");
        }
        setDone(true);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong.");
      }
    });
  };

  if (done) {
    return (
      <p className="rounded-2xl bg-moss-500/10 px-4 py-3 text-sm text-moss-700">
        Subscription cancelled. You keep access until{" "}
        {paidUntil
          ? new Date(paidUntil).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          : "the end of the current cycle"}
        . Thanks for trying ExamGrind 💛
      </p>
    );
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="text-xs font-medium text-cocoa-500 underline-offset-4 hover:text-cocoa-900 hover:underline"
      >
        Cancel subscription
      </button>
    );
  }

  return (
    <div className="space-y-2 rounded-2xl border border-cocoa-900/[0.08] bg-warm-wash p-4">
      <p className="text-sm text-cocoa-700">
        Cancel — you&apos;ll keep access until{" "}
        <strong className="text-cocoa-900">
          {paidUntil
            ? new Date(paidUntil).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "the end of this cycle"}
        </strong>
        . No further charges after that.
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={cancel}
          disabled={pending}
          className="rounded-full bg-ember-600 px-4 py-1.5 text-xs font-semibold text-cream-50 transition hover:bg-ember-700 disabled:opacity-60"
        >
          {pending ? "Cancelling…" : "Yes, cancel"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={pending}
          className="rounded-full border border-cocoa-900/[0.08] bg-cream-50 px-4 py-1.5 text-xs font-semibold text-cocoa-700 transition hover:bg-white"
        >
          Keep my plan
        </button>
      </div>
      {error && <p className="text-xs text-ember-700">{error}</p>}
    </div>
  );
}
