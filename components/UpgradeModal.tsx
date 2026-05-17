"use client";

import { useState } from "react";
import Chick from "@/components/Chick";

export type PaywallReason =
  | "quiz-limit"
  | "analysis-limit"
  | "deep-dive"
  | "manual"; // direct "Upgrade" click

type Props = {
  open: boolean;
  onClose: () => void;
  reason: PaywallReason;
  /** Optional usage data for the headline ("3 of 3 used"). */
  used?: number;
  limit?: number;
};

/**
 * One modal to gate everything. Different `reason` → different headline,
 * same body and CTA. Razorpay checkout swaps in here when wired.
 */
export default function UpgradeModal({
  open,
  onClose,
  reason,
  used,
  limit,
}: Props) {
  const [toastShown, setToastShown] = useState(false);

  if (!open) return null;

  const headline =
    reason === "quiz-limit"
      ? "You've used your 3 free quizzes"
      : reason === "analysis-limit"
      ? "You've used your free analysis"
      : reason === "deep-dive"
      ? "Deep Dive is a paid feature"
      : "Unlock everything";

  const sub =
    reason === "quiz-limit"
      ? `${used ?? "—"} / ${limit ?? 3} free quizzes used. Upgrade to keep practicing.`
      : reason === "analysis-limit"
      ? "Upgrade to keep diagnosing every quiz."
      : reason === "deep-dive"
      ? "Deep Dive uses our most thorough model — exhaustive walkthroughs, second-order patterns, a 7-day plan."
      : "Get the full ExamGrind experience for ₹75 / month.";

  const handleUpgrade = () => {
    // Razorpay checkout placeholder. When wired, replace this with a POST
    // to /api/billing/checkout and a redirect.
    setToastShown(true);
    setTimeout(() => setToastShown(false), 3500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="upgrade-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-cocoa-900/40 px-4 sm:px-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-cocoa-900/[0.06] bg-cream-50 shadow-warm-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-sun-400/30 via-sun-500/20 to-ember-500/20 p-6 text-center">
          <Chick state="excited" size={96} className="mx-auto" />
          <h2
            id="upgrade-modal-title"
            className="mt-3 font-serif text-2xl font-bold leading-tight text-cocoa-900 sm:text-3xl"
          >
            {headline}
          </h2>
          <p className="mt-2 text-sm text-cocoa-700">{sub}</p>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cocoa-500">
            What you get for ₹75 / month
          </p>
          <ul className="mt-3 space-y-2.5">
            <Feature>Unlimited quizzes — every subject, every topic</Feature>
            <Feature>Unlimited Deep Analyses on every quiz</Feature>
            <Feature>
              <span className="font-semibold">Deep Dive 👑</span> — exhaustive walkthroughs + 7-day plans
            </Feature>
            <Feature>Drill-the-concept mini-quizzes on tap</Feature>
            <Feature>Priority on every new feature</Feature>
          </ul>

          <button
            onClick={handleUpgrade}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-sun-400 via-sun-500 to-ember-500 px-6 py-3.5 text-sm font-bold text-cocoa-900 shadow-warm-lg transition hover:scale-[1.01]"
          >
            <span>👑</span>
            <span>Upgrade — ₹75 / month</span>
          </button>
          <button
            onClick={onClose}
            className="mt-2 inline-flex w-full items-center justify-center rounded-2xl px-6 py-2.5 text-sm font-medium text-cocoa-500 transition hover:text-cocoa-900"
          >
            Maybe later
          </button>

          {toastShown && (
            <p
              className="mt-3 rounded-xl bg-cocoa-900/90 px-4 py-2.5 text-center text-xs font-medium text-cream-50"
              role="status"
            >
              Razorpay checkout coming soon — we&apos;ll wire it next.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Feature({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <span
        className="mt-1 flex size-4 shrink-0 items-center justify-center rounded-full bg-ember-600 text-[10px] font-bold text-cream-50"
        aria-hidden="true"
      >
        ✓
      </span>
      <span className="text-sm text-cocoa-900">{children}</span>
    </li>
  );
}
