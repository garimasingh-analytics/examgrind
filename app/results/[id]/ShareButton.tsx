"use client";

import { useState } from "react";

type Props = {
  quizId: string;
  /** Score string like "8/10" — used in the share text. */
  scoreLabel: string;
  /** Topic name like "Latent Heat". */
  topic: string;
  accuracy: number;
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
}: Props) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/share/${quizId}`
      : `https://examgrind.vercel.app/share/${quizId}`;

  const text =
    accuracy >= 90
      ? `Aced ${topic} on ExamGrind — ${scoreLabel}. The AI broke down exactly which concepts I owned. Try it free 👇`
      : accuracy >= 70
      ? `Scored ${scoreLabel} on ${topic}. ExamGrind's AI told me exactly what to drill next. Free to try 👇`
      : accuracy >= 40
      ? `Practicing ${topic} on ExamGrind. The AI shows you exactly where you went wrong, question by question. Free 👇`
      : `Tough quiz on ${topic} — but ExamGrind's AI walked me through every wrong answer. Free CUET practice 👇`;

  const handleShare = async () => {
    setError(null);
    // Try native share first (mobile)
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `ExamGrind — ${scoreLabel} on ${topic}`,
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
        <span>{copied ? "Link copied!" : "Share my score"}</span>
      </button>
      {error && (
        <p className="text-xs text-coral-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
