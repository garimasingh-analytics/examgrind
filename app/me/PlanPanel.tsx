"use client";

import { useState } from "react";
import Link from "next/link";
import UpgradeModal from "@/components/UpgradeModal";

type Props = {
  subscriptionStatus: "free" | "trial" | "paid";
  paidUntil: string | null;
  quizzesStarted: number;
  analysesTaken: number;
  analysisCredits: number;
  scoreBoostDaysLeft: number;
};

const FREE_QUIZ_LIMIT = 3;
const FREE_ANALYSIS_LIMIT = 1;

export default function PlanPanel({
  subscriptionStatus,
  paidUntil,
  quizzesStarted,
  analysesTaken,
  analysisCredits,
  scoreBoostDaysLeft,
}: Props) {
  const [open, setOpen] = useState(false);
  const isPaid = subscriptionStatus === "paid";

  const quizLeft = Math.max(0, FREE_QUIZ_LIMIT - quizzesStarted);
  const analysisLeft = Math.max(0, FREE_ANALYSIS_LIMIT - analysesTaken);
  const coachUntil = paidUntil
    ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(paidUntil))
    : null;

  return (
    <>
      <div
        className={`plan-ledger overflow-hidden rounded-3xl border shadow-warm-lg ${
          isPaid
            ? "border-sun-500/30 bg-gradient-to-br from-sun-400/10 to-ember-500/10"
            : "border-cocoa-900/[0.06] bg-cream-50"
        }`}
      >
        <div className="plan-ledger-head flex items-center justify-between gap-3 px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cocoa-500">
              Plan
            </p>
            <p className="mt-1 font-serif text-2xl font-bold text-cocoa-900">
              {isPaid ? "ExamGrind Coach 👑" : "Free plan"}
            </p>
            <p className="mt-1 text-xs text-cocoa-600">
              {isPaid
                ? `Coach is active${coachUntil ? ` until ${coachUntil}` : ""}.`
                : "Your active purchases are listed below."}
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

        <div className="border-t border-cocoa-900/[0.06] bg-cream-50/70 p-4 sm:p-5">
          <div className="flex items-baseline justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cocoa-500">Your access</p>
              <p className="mt-1 text-sm font-semibold text-cocoa-900">What you can use right now</p>
            </div>
            {isPaid && <span className="rounded-full bg-sun-400/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ember-700">Unlimited</span>}
          </div>
          <div className="plan-access-grid mt-3 grid gap-3 sm:grid-cols-3">
            <AccessCard
              icon="🔎"
              title="AI Deep Analysis"
              value={isPaid ? "Unlimited" : analysisCredits > 0 ? `${analysisCredits} ready` : analysisLeft > 0 ? `${analysisLeft} free left` : "None ready"}
              detail={isPaid ? "Included with Coach." : analysisCredits > 0 ? "Your paid analysis credit is active." : analysisLeft > 0 ? "Use it after any completed quiz or mock." : "Buy one for ₹19 whenever you need it."}
              active={isPaid || analysisCredits > 0 || analysisLeft > 0}
              href={isPaid || analysisCredits > 0 || analysisLeft > 0 ? "/home" : undefined}
              onClick={isPaid || analysisCredits > 0 || analysisLeft > 0 ? undefined : () => setOpen(true)}
            />
            <AccessCard
              icon="🗓️"
              title="21-Day Score Boost"
              value={isPaid ? "Included" : scoreBoostDaysLeft > 0 ? `${scoreBoostDaysLeft} days active` : "Not active"}
              detail={isPaid ? "Your Coach plan includes ongoing planning." : scoreBoostDaysLeft > 0 ? "Your fixed personalised roadmap is ready." : "A fixed personal roadmap for ₹49."}
              active={isPaid || scoreBoostDaysLeft > 0}
              href={scoreBoostDaysLeft > 0 || isPaid ? "/score-boost" : undefined}
              onClick={scoreBoostDaysLeft > 0 || isPaid ? undefined : () => setOpen(true)}
            />
            <AccessCard
              icon="👑"
              title="ExamGrind Coach"
              value={isPaid ? "Active" : "Not active"}
              detail={isPaid ? "Unlimited quizzes, mocks and analyses." : "Unlimited practice and continuous AI coaching for ₹199/month."}
              active={isPaid}
              href={isPaid ? "/coach" : undefined}
              onClick={isPaid ? undefined : () => setOpen(true)}
            />
          </div>
        </div>
      </div>

      <UpgradeModal
        open={open}
        onClose={() => setOpen(false)}
        reason="manual"
      />
    </>
  );
}

function AccessCard({
  icon,
  title,
  value,
  detail,
  active,
  href,
  onClick,
}: {
  icon: string;
  title: string;
  value: string;
  detail: string;
  active: boolean;
  href?: string;
  onClick?: () => void;
}) {
  const body = <>
    <div className="flex items-center justify-between gap-2"><span className="text-lg" aria-hidden>{icon}</span><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${active ? "bg-moss-500/15 text-moss-700" : "bg-cocoa-100 text-cocoa-500"}`}>{active ? "Active" : "Locked"}</span></div>
    <p className="mt-3 text-xs font-semibold text-cocoa-700">{title}</p>
    <p className="mt-1 font-serif text-lg font-bold text-cocoa-900">{value}</p>
    <p className="mt-1 text-[11px] leading-relaxed text-cocoa-500">{detail}</p>
    {href && <p className="mt-3 text-xs font-bold text-ember-700">Open plan →</p>}
  </>;
  const className = "plan-access-card rounded-2xl border border-cocoa-900/[0.06] bg-cream-100 p-3.5 transition";
  if (href) return <Link href={href} className={`${className} hover:-translate-y-0.5 hover:bg-white`}>{body}</Link>;
  if (onClick) return <button type="button" onClick={onClick} className={`${className} w-full text-left hover:-translate-y-0.5 hover:bg-white`}>{body}</button>;
  return <div className={className}>{body}</div>;
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
