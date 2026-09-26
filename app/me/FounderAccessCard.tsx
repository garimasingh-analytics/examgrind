"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  active: boolean;
};

export default function FounderAccessCard({ active }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const activate = async () => {
    setPending(true);
    setError("");

    try {
      const response = await fetch("/api/founder/activate-lifetime", {
        method: "POST",
      });
      const payload = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "We couldn't activate founder access right now.");
      }

      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "We couldn't activate founder access right now."
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="mb-4 rounded-3xl border border-sun-500/35 bg-cream-50 p-5 shadow-warm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cocoa-500">
            Founder access
          </p>
          <h2 className="mt-2 font-serif text-2xl font-bold text-cocoa-900">
            {active ? "Your permanent full access is active." : "Make this your permanent full-access account."}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-cocoa-600">
            {active
              ? "This account has the full ExamGrind paid experience with no renewal date."
              : "This uses the same paid entitlement as students, so every existing premium feature stays unlocked across the web and Play Store app."}
          </p>
        </div>

        {!active && (
          <button
            type="button"
            onClick={activate}
            disabled={pending}
            className="inline-flex shrink-0 items-center justify-center rounded-2xl bg-cocoa-900 px-4 py-3 text-sm font-bold text-cream-50 shadow-warm transition hover:bg-cocoa-800 disabled:cursor-wait disabled:opacity-70"
          >
            {pending ? "Activating…" : "Activate forever"}
          </button>
        )}
      </div>
      {error && (
        <p role="alert" className="mt-3 text-sm font-medium text-ember-700">
          {error}
        </p>
      )}
    </div>
  );
}
