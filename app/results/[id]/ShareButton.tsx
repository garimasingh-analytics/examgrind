"use client";

import { useState } from "react";

type Props = {
  quizId: string;
  /** Score string like "8/10" — used in the share text. */
  scoreLabel: string;
  /** Topic name like "Latent Heat". */
  topic: string;
  accuracy: number;
  /** A repair share is only offered after a reliable fresh-question round. */
  mode?: "quiz" | "recovery";
};

/**
 * Share button — generates a public /share/<id> URL with a pre-baked
 * Open Graph image and an attention-grabbing description, then either
 * triggers the native Web Share API (mobile) or copies the link with
 * a toast confirmation (desktop).
 *
 * Every share is a free distribution unit. This is the single highest
 * leverage growth feature in the product.
 */
export default function ShareButton({
  quizId,
  scoreLabel,
  topic,
  accuracy,
  mode = "quiz",
}: Props) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/share/${quizId}`
      : `https://examgrind.in/share/${quizId}`;

  const quizText =
    accuracy >= 90
      ? `Aced ${topic} on ExamGrind — ${scoreLabel}. Today’s practice gave me a clear next step. Try it free 👇`
      : accuracy >= 70
      ? `Scored ${scoreLabel} on ${topic}. Now I know exactly what to practise next. Try it free 👇`
      : accuracy >= 40
      ? `Practising ${topic} on ExamGrind. It shows the patterns behind the mistakes, question by question. Try it free 👇`
      : `Tough quiz on ${topic}—but I now have a clear repair path for the mistakes. Try ExamGrind 👇`;

  const text = mode === "recovery"
    ? `I just repaired ${topic}: ${scoreLabel} on a fresh-question round. One weak concept, one focused repair, real proof. Try ExamGrind 👇`
    : quizText;

  const handleShare = async () => {
    setError(null);
    // Try native share first (mobile)
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: mode === "recovery" ? `ExamGrind — repaired ${topic}` : `ExamGrind — ${scoreLabel} on ${topic}`,
          text,
          url,
        });
        return;
      } catch (e) {
        // User cancelled — that's fine, don't show an error
        if (e instanceof Error && e.name === "AbortError") return;
        // Fall through to clipboard
      }
    }
    // Desktop / unsupported — copy to clipboard
    try {
      await navigator.clipboard.writeText(`${text}\n\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setError("Couldn't access the clipboard. Copy the link manually.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleShare}
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-sun-400 via-sun-500 to-ember-500 px-6 py-3 text-sm font-bold text-cocoa-900 shadow-warm transition hover:scale-[1.02] active:scale-[0.99]"
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
          <path
            d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7M16 6l-4-4-4 4M12 2v13"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>{copied ? "Link copied!" : mode === "recovery" ? "Share this proof" : "Share my score"}</span>
      </button>
      {error && (
        <p className="text-xs text-coral-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
