"use client";

import Link from "next/link";
import { trackDailyMissionStarted } from "@/lib/product-analytics";

type Props = {
  steps: MissionStep[];
  scoreBoostDay?: number | null;
  isCoach?: boolean;
};

export type MissionStep = {
  href: string;
  subjectId: string;
  subjectName: string;
  topicName: string | null;
  type: "foundation" | "repair" | "revision" | "advance";
  accuracy: number | null;
  completed: boolean;
};

const stepCopy = (step: MissionStep) => {
  if (step.type === "repair") return {
    label: "Repair a weak area",
    detail: step.accuracy == null
      ? "Turn a weak spot into a reliable mark."
      : `Earlier accuracy: ${step.accuracy}%.`,
    button: "Repair",
  };
  if (step.type === "revision") return {
    label: "Recall before you forget",
    detail: "A short recall round keeps this topic exam-ready.",
    button: "Recall",
  };
  if (step.type === "foundation") return {
    label: "Build your base",
    detail: "Start this topic to create your first signal.",
    button: "Start",
  };
  return {
    label: "Build fresh coverage",
    detail: "Move one under-covered subject forward today.",
    button: "Build",
  };
};

/** A short, evidence-based study session rather than a single quiz prompt. */
export default function DailyMissionCard({
  steps,
  scoreBoostDay,
  isCoach = false,
}: Props) {
  const startMission = (type: MissionStep["type"]) => {
    // Quiz creation can take a minute, so preserve a short-lived anonymous
    // source marker in this browser only. QuizRunner consumes it once after a
    // real completion; it is never sent to the server or attached to a user.
    window.sessionStorage.setItem(
      "examgrind:active-mission",
      JSON.stringify({ type, startedAt: Date.now() }),
    );
    trackDailyMissionStarted({ mission_type: type });
  };
  const completedCount = steps.filter((step) => step.completed).length;
  const nextStep = steps.find((step) => !step.completed) ?? steps[0];

  return (
    <section id="daily-mission" className="mx-auto mt-7 max-w-5xl scroll-mt-5 px-4 sm:px-6">
      <div className="overflow-hidden rounded-3xl border border-ember-600/20 bg-gradient-to-br from-cocoa-900 via-cocoa-900 to-ember-900 p-5 shadow-warm-lg sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-sun-300">Daily mission · {completedCount} of {steps.length} steps done</p>
            <h2 className="mt-2 font-serif text-2xl font-semibold text-cream-50 sm:text-3xl">
              A complete study session, chosen for you.
            </h2>
            <p className="mt-2 text-sm leading-6 text-cream-100/80 sm:text-base">
              Repair, recall, and build coverage across your {steps.length > 1 ? "selected exam subjects" : "selected exam"}. Finish the steps in any order.
            </p>
            {scoreBoostDay && (
              <Link
                href="/score-boost"
                className="mt-3 inline-flex items-center gap-2 rounded-xl border border-sun-300/35 bg-sun-400/15 px-3 py-2 text-xs font-bold text-sun-200 transition hover:bg-sun-400/25"
              >
                Your 21-Day Score Boost · Day {scoreBoostDay} of 21 <span aria-hidden>→</span>
              </Link>
            )}
          </div>
          {nextStep && (
            <Link
              href={nextStep.href}
              onClick={() => startMission(nextStep.type)}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-sun-400 px-4 py-3 text-sm font-bold text-cocoa-900 shadow-warm transition hover:-translate-y-0.5 hover:bg-sun-300"
            >
              Start next step <span aria-hidden>→</span>
            </Link>
          )}
        </div>
        <ol className="mt-5 grid gap-3 md:grid-cols-3">
          {steps.map((step, index) => {
            const copy = stepCopy(step);
            return (
              <li key={`${step.type}-${step.href}`} className={`rounded-2xl border p-4 ${step.completed ? "border-moss-500/35 bg-moss-500/15" : "border-cream-50/15 bg-cream-50/10"}`}>
                <div className="flex items-start gap-2">
                  <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${step.completed ? "bg-moss-400 text-cocoa-900" : "bg-sun-400 text-cocoa-900"}`}>
                    {step.completed ? "✓" : index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-sun-200">{copy.label}</p>
                    <p className="mt-1 font-serif text-base font-semibold text-cream-50">{step.topicName ?? step.subjectName}</p>
                    <p className="mt-1 text-xs text-cream-100/70">{step.subjectName} · {copy.detail}</p>
                  </div>
                </div>
                {!step.completed && (
                  <Link href={step.href} onClick={() => startMission(step.type)} className="mt-3 inline-flex text-xs font-bold text-sun-200 hover:text-sun-100">
                    {copy.button} →
                  </Link>
                )}
                {step.completed && <p className="mt-3 text-xs font-bold text-moss-300">Done today</p>}
              </li>
            );
          })}
        </ol>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-cream-50/10 bg-cocoa-950/20 px-4 py-3 text-xs">
          <p className="text-cream-100/75">
            <span className="font-bold text-sun-200">{isCoach ? "ExamGrind Coach is live." : "Want the plan to adapt after every quiz?"}</span>{" "}
            {isCoach ? "Your briefing updates from your completed practice." : "Coach turns today’s evidence into an ongoing study plan."}
          </p>
          <Link href={isCoach ? "/coach" : "/me"} className="shrink-0 font-bold text-sun-200 hover:text-sun-100">
            {isCoach ? "Open Coach briefing →" : "Explore Coach →"}
          </Link>
        </div>
      </div>
    </section>
  );
}
