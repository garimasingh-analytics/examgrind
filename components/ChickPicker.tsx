"use client";

import { useState } from "react";
import Chick from "./Chick";
import { useChickVariant } from "./ChickVariantContext";
import { CHICK_VARIANTS, getUnlockedChicks, type ChickVariant } from "@/lib/chicks";

type Props = {
  xp: number;
  isPremium: boolean;
  explicitlyGranted?: ChickVariant[];
};

export default function ChickPicker({ xp, isPremium, explicitlyGranted = [] }: Props) {
  const { variant, setVariant } = useChickVariant();
  const [saving, setSaving] = useState<ChickVariant | null>(null);
  const [message, setMessage] = useState("");
  const unlocked = new Set(getUnlockedChicks(xp, isPremium, explicitlyGranted));

  async function choose(next: ChickVariant) {
    if (!unlocked.has(next) || saving) return;
    setSaving(next);
    setMessage("");
    const previous = variant;
    setVariant(next);
    try {
      const response = await fetch("/api/me/chick", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ variant: next }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) {
        setVariant(previous);
        setMessage(result.error ?? "Couldn’t save that look. Please try again.");
        return;
      }
      setMessage("Saved across ExamGrind.");
    } catch {
      setVariant(previous);
      setMessage("Couldn’t save that look. Please try again.");
    } finally {
      setSaving(null);
    }
  }

  return (
    <section className="mt-8 rounded-3xl border border-cocoa-900/[0.08] bg-cream-50 p-5 shadow-warm sm:p-6" aria-labelledby="study-buddy-title">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eg-kicker text-ember-700">Your study buddy</p>
          <h2 id="study-buddy-title" className="mt-1 text-2xl font-display font-bold text-cocoa-900">Build your chick wardrobe.</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-cocoa-500">Earn points by learning and practising, then choose the little look that follows you across ExamGrind.</p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-cocoa-900/[0.08] bg-white/70 px-4 py-3">
          <Chick state="happy" size={54} variant={variant} />
          <p className="text-sm font-bold text-cocoa-900"><span className="block text-xs font-medium text-cocoa-500">Your points</span>{xp.toLocaleString()} XP</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {CHICK_VARIANTS.map((chick) => {
          const isUnlocked = unlocked.has(chick.id);
          const isSelected = variant === chick.id;
          const requirement = chick.unlockXp === -1 ? "Premium" : chick.unlockXp === -2 ? "Special unlock" : chick.unlockXp === 0 ? "Ready" : `${chick.unlockXp.toLocaleString()} XP`;
          return (
            <button
              type="button"
              key={chick.id}
              onClick={() => choose(chick.id)}
              disabled={!isUnlocked || Boolean(saving)}
              aria-pressed={isSelected}
              className={`group relative min-h-48 rounded-2xl border p-3 text-left transition ${isSelected ? "border-ember-600 bg-ember-50 ring-2 ring-ember-600/15" : isUnlocked ? "border-cocoa-900/[.09] bg-white hover:-translate-y-0.5 hover:shadow-warm" : "cursor-not-allowed border-cocoa-900/[.06] bg-cream-100/60 opacity-65"}`}
            >
              <div className="flex items-start justify-between gap-2"><span className="text-xs font-bold text-cocoa-500">{chick.emoji}</span><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${isUnlocked ? "bg-mint-100 text-mint-800" : "bg-cocoa-900/[.07] text-cocoa-600"}`}>{isSelected ? "Wearing" : requirement}</span></div>
              <div className="mt-1 flex justify-center"><Chick state={isSelected ? "happy" : "idle"} size={70} variant={chick.id} /></div>
              <p className="mt-1 text-sm font-bold text-cocoa-900">{chick.name}</p>
              <p className="mt-1 text-xs leading-4 text-cocoa-500">{chick.blurb}</p>
            </button>
          );
        })}
      </div>
      <p className="mt-4 min-h-5 text-center text-xs font-semibold text-ember-700" aria-live="polite">{message}</p>
    </section>
  );
}
