"use client";

import { useState, useTransition } from "react";
import Chick from "./Chick";
import { useChickVariant } from "./ChickVariantContext";
import { CHICK_VARIANTS, isChickUnlocked, type ChickVariant } from "@/lib/chicks";

type Props = {
  userXp: number;
  isPremium: boolean;
  grantedChicks?: ChickVariant[];
};

export default function ChickPicker({ userXp, isPremium, grantedChicks = [] }: Props) {
  const { variant, setVariant } = useChickVariant();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handlePick(target: ChickVariant) {
    const unlocked = isChickUnlocked(target, userXp, isPremium, grantedChicks);
    if (!unlocked) {
      const def = CHICK_VARIANTS.find((c) => c.id === target);
      if (def?.unlockXp === -1) {
        setError("👑 The royal chick is for Premium members only.");
      } else if (def?.unlockXp === -2) {
        setError("🌟 This is a code-only chick. Redeem a promo code below to unlock.");
      } else {
        setError(`🔒 Earn ${def?.unlockXp.toLocaleString("en-IN")} XP to unlock — you have ${userXp.toLocaleString("en-IN")}.`);
      }
      return;
    }
    setError(null);
    setVariant(target); // instant local update
    startTransition(async () => {
      try {
        await fetch("/api/me/chick", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ variant: target }),
        });
      } catch {
        // server save failed — local pick still works for this session
      }
    });
  }

  return (
    <section className="mt-8">
      <h2 className="text-xl font-display font-bold text-cocoa-900 mb-1">
        Your chick wardrobe 🐥
      </h2>
      <p className="text-sm text-cocoa-500 mb-4">
        Unlock new skins as you earn XP. Your selected chick shows up everywhere across the app.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {CHICK_VARIANTS.map((def) => {
          const unlocked = isChickUnlocked(def.id, userXp, isPremium, grantedChicks);
          const active = variant === def.id;
          return (
            <button
              key={def.id}
              type="button"
              onClick={() => handlePick(def.id)}
              disabled={isPending}
              className={[
                "relative flex flex-col items-center rounded-2xl p-4 transition border-2",
                active
                  ? "border-coral-500 bg-coral-50 shadow-md scale-[1.02]"
                  : unlocked
                  ? "border-cocoa-100 bg-white hover:border-cocoa-300 hover:scale-[1.01]"
                  : "border-cocoa-100 bg-cocoa-50 opacity-60 cursor-not-allowed",
              ].join(" ")}
              aria-pressed={active}
              aria-label={`${def.name} — ${unlocked ? "unlocked" : "locked"}`}
            >
              <div className="relative">
                <Chick state={active ? "happy" : "idle"} size={84} variant={def.id} />
                {!unlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/35 rounded-full text-3xl">
                    🔒
                  </div>
                )}
                {active && (
                  <div className="absolute -top-1 -right-1 bg-coral-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow">
                    ✓
                  </div>
                )}
              </div>
              <div className="mt-2 text-sm font-semibold text-cocoa-900 text-center">
                {def.emoji} {def.name}
              </div>
              <div className="text-xs text-cocoa-500 text-center mt-0.5 leading-tight">
                {def.blurb}
              </div>
              <div className="mt-2 text-xs font-mono">
                {def.unlockXp === 0 && (
                  <span className="text-green-600">Free</span>
                )}
                {def.unlockXp === -1 && (
                  <span className="text-amber-600">Premium 👑</span>
                )}
                {def.unlockXp === -2 && (
                  <span className="text-purple-600">Code-only 🌟</span>
                )}
                {def.unlockXp > 0 && (
                  <span className={unlocked ? "text-green-600" : "text-cocoa-400"}>
                    {def.unlockXp.toLocaleString("en-IN")} XP
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {error && (
        <p className="mt-3 text-sm text-coral-700 bg-coral-50 border border-coral-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
    </section>
  );
}
