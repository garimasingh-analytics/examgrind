"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { SHIELD_COST_XP, MAX_SHIELDS } from "@/lib/streak";

type Props = {
  /** Current XP balance (from server). */
  xp: number;
  /** Currently held shields (0..MAX_SHIELDS). */
  shields: number;
  /** Lifetime shields auto-consumed by the streak sweep. */
  totalUsed: number;
};

/**
 * Streak Insurance panel — buy XP-purchased shields that auto-protect the
 * daily streak when the user misses a day.
 *
 * Layout: shield slot row (3 slots, lit vs empty), copy, primary CTA.
 * State is optimistic — local count and XP tick up/down immediately, then
 * we router.refresh() to re-sync with server-truth.
 */
export default function ShieldPanel({ xp, shields, totalUsed }: Props) {
  const router = useRouter();
  const [optimisticXp, setOptimisticXp] = useState(xp);
  const [optimisticShields, setOptimisticShields] = useState(shields);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const canAfford = optimisticXp >= SHIELD_COST_XP;
  const atCap = optimisticShields >= MAX_SHIELDS;
  const disabled = !canAfford || atCap || pending;

  const onBuy = () => {
    setError(null);
    // Optimistic local update — feels instant. We roll back on server error.
    const prevXp = optimisticXp;
    const prevShields = optimisticShields;
    setOptimisticXp(prevXp - SHIELD_COST_XP);
    setOptimisticShields(prevShields + 1);

    startTransition(async () => {
      try {
        const res = await fetch("/api/streak/buy-shield", { method: "POST" });
        const json = (await res.json().catch(() => ({}))) as {
          ok?: boolean;
          xp?: number;
          streak_shields?: number;
          message?: string;
          error?: string;
        };
        if (!res.ok || !json.ok) {
          // Roll back optimistic update
          setOptimisticXp(prevXp);
          setOptimisticShields(prevShields);
          setError(json.message ?? json.error ?? "Couldn't buy a shield.");
          return;
        }
        // Reconcile with server truth (in case of race with quiz/complete)
        if (typeof json.xp === "number") setOptimisticXp(json.xp);
        if (typeof json.streak_shields === "number")
          setOptimisticShields(json.streak_shields);
        // Refresh server data — picks up any user_topic_mastery / events too
        router.refresh();
      } catch (e) {
        setOptimisticXp(prevXp);
        setOptimisticShields(prevShields);
        setError(e instanceof Error ? e.message : "Network error.");
      }
    });
  };

  const ctaLabel = pending
    ? "Buying…"
    : atCap
      ? "Shield slots full"
      : !canAfford
        ? `Need ${SHIELD_COST_XP - optimisticXp} more XP`
        : `Buy a shield · ${SHIELD_COST_XP} XP`;

  return (
    <div className="rounded-3xl border border-cocoa-900/[0.06] bg-cream-50 p-5 shadow-warm">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-serif text-xl font-bold text-cocoa-900">
          Streak Insurance 🛡️
        </h2>
        <p className="text-xs text-cocoa-500">
          {SHIELD_COST_XP} XP per shield · max {MAX_SHIELDS}
        </p>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-cocoa-600">
        Life happens. A shield auto-burns to save your streak if you miss
        exactly one day — no manual action needed. Stack up to {MAX_SHIELDS}.
      </p>

      {/* Shield slots — 3 dots, lit ones colored, empty ones outlined */}
      <div className="mt-4 flex items-center gap-3">
        {Array.from({ length: MAX_SHIELDS }).map((_, i) => {
          const lit = i < optimisticShields;
          return (
            <div
              key={i}
              aria-label={lit ? "Shield ready" : "Empty slot"}
              className={`flex h-12 w-12 items-center justify-center rounded-full text-2xl transition ${
                lit
                  ? "bg-gradient-to-br from-sun-100 to-ember-100 text-ember-700 shadow-inner ring-2 ring-ember-300"
                  : "border-2 border-dashed border-cocoa-900/[0.12] text-cocoa-300"
              }`}
            >
              🛡️
            </div>
          );
        })}
        <div className="ml-2 flex flex-col text-sm">
          <span className="font-semibold text-cocoa-900">
            {optimisticShields} / {MAX_SHIELDS} ready
          </span>
          {totalUsed > 0 && (
            <span className="text-xs text-cocoa-500">
              {totalUsed} saved your streak so far
            </span>
          )}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <div className="text-xs text-cocoa-500">
          Your XP: <span className="font-mono font-semibold text-cocoa-900">{optimisticXp}</span>
        </div>
        <button
          type="button"
          onClick={onBuy}
          disabled={disabled}
          className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition ${
            disabled
              ? "cursor-not-allowed bg-cocoa-900/[0.06] text-cocoa-400"
              : "bg-cocoa-900 text-cream-50 shadow-warm hover:opacity-90"
          }`}
        >
          {ctaLabel}
        </button>
      </div>

      {error && (
        <p className="mt-3 rounded-lg bg-ember-50 px-3 py-2 text-xs text-ember-700">
          {error}
        </p>
      )}
    </div>
  );
}
