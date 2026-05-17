"use client";

import { useState } from "react";
import UpgradeModal from "@/components/UpgradeModal";

type Props = {
  subscriptionStatus: "free" | "trial" | "paid";
  quizzesStarted: number;
  analysesTaken: number;
};

const FREE_QUIZ_LIMIT = 3;
const FREE_ANALYSIS_LIMIT = 1;

export default function PlanPanel({
  subscriptionStatus,
  quizzesStarted,
  analysesTaken,
}: Props) {
  const [open, setOpen] = useState(false);
  const isPaid = subscriptionStatus === "paid";

  const quizLeft = Math.max(0, FREE_QUIZ_LIMIT - quizzesStarted);
  const analysisLeft = Math.max(0, FREE_ANALYSIS_LIMIT - analysesTaken);

  return (
    <>
      <div
        className={`overflow-hidden rounded-3xl border shadow-warm-lg ${
          isPaid
            ? "border-sun-500/30 bg-gradient-to-br from-sun-400/10 to-ember-500/10"
            : "border-cocoa-900/[0.06] bg-cream-50"
        }`}
      >
        <div className="flex items-center justify-between gap-3 px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cocoa-500">
              Plan
            </p>
            <p className="mt-1 font-serif text-2xl font-bold text-cocoa-900">
              {isPaid ? "ExamGrind Premium 👑" : "Free"}
            </p>
          </div>
          {!isPaid && (
            <button
              onClick={() => setOpen(true)}
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-br from-sun-400 via-sun-500 to-ember-500 px-4 py-2.5 text-xs font-bold text-cocoa-900 shadow-warm transition hover:scale-[1.02]"
            >
              <span>👑</span>
              <span>Upgrade</span>
            </button>
          )}
        </div>

        {!isPaid && (
          <div className="grid grid-cols-2 gap-3 border-t border-cocoa-900/[0.04] bg-cream-100/40 p-4 sm:p-5">
            <Meter
              label="Quizzes"
              used={quizzesStarted}
              limit={FREE_QUIZ_LIMIT}
              left={quizLeft}
            />
            <Meter
              label="Analyses"
              used={analysesTaken}
              limit={FREE_ANALYSIS_LIMIT}
              left={analysisLeft}
            />
          </div>
        )}
      </div>

      <UpgradeModal
        open={open}
        onClose={() => setOpen(false)}
        reason="manual"
      />
    </>
  );
}

function Meter({
  label,
  used,
  limit,
  left,
}: {
  label: string;
  used: number;
  limit: number;
  left: number;
}) {
  const pct = Math.min(100, Math.round((used / limit) * 100));
  const exhausted = left === 0;
  return (
    <div className="rounded-2xl border border-cocoa-900/[0.04] bg-cream-50 p-3">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-cocoa-500">
          {label}
        </p>
        <p
          className={`font-mono text-xs font-bold tabular-nums ${
            exhausted ? "text-ember-700" : "text-cocoa-900"
          }`}
        >
          {used} / {limit}
        </p>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-cream-200">
        <div
          className={`h-full rounded-full transition-all ${
            exhausted
              ? "bg-gradient-to-r from-ember-500 to-coral-500"
              : "bg-gradient-to-r from-sun-500 to-ember-600"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1.5 text-[10px] text-cocoa-500">
        {exhausted ? "Limit reached" : `${left} left`}
      </p>
    </div>
  );
}
