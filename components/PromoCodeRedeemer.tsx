"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function PromoCodeRedeemer() {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!code.trim()) return;
    startTransition(async () => {
      try {
        const res = await fetch("/api/promo/redeem", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ code: code.trim() }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Couldn't redeem this code.");
          return;
        }
        const emoji = data.chick === "cosmic" ? "🌟" : data.chick === "squad" ? "🤝" : data.chick === "phoenix" ? "🔥" : "🐥";
        setSuccess(
          data.alreadyUnlocked
            ? `${emoji} You already had the ${data.chick} chick — enjoy.`
            : `${emoji} Unlocked the ${data.chick} chick! Scroll up to your wardrobe.`
        );
        setCode("");
        router.refresh();
      } catch {
        setError("Network error — try again.");
      }
    });
  }

  return (
    <section className="mt-6 rounded-2xl border border-cocoa-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-cocoa-900">Got a code? 🌟</h3>
      <p className="text-xs text-cocoa-500 mt-0.5 mb-3">
        Paste a promo code to unlock exclusive chicks that can&apos;t be earned with XP.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="LAUNCH100"
          maxLength={32}
          autoCapitalize="characters"
          spellCheck={false}
          className="flex-1 rounded-lg border border-cocoa-200 bg-cream-100 px-3 py-2 font-mono text-sm uppercase tracking-wide focus:border-coral-500 focus:outline-none focus:ring-2 focus:ring-coral-200"
        />
        <button
          type="submit"
          disabled={isPending || !code.trim()}
          className="rounded-lg bg-coral-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-coral-600 disabled:opacity-50"
        >
          {isPending ? "..." : "Redeem"}
        </button>
      </form>
      {error && (
        <p className="mt-2 text-xs text-coral-700 bg-coral-50 border border-coral-200 rounded-lg px-2 py-1.5">
          {error}
        </p>
      )}
      {success && (
        <p className="mt-2 text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-2 py-1.5">
          {success}
        </p>
      )}
    </section>
  );
}
