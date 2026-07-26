"use client";

import Link from "next/link";
import { trackDailyMissionStarted } from "@/lib/product-analytics";

type Props = {
  href: string;
  subjectName: string;
  topicName: string | null;
  type: "foundation" | "repair" | "revision" | "advance";
  accuracy: number | null;
  scoreBoostDay?: number | null;
};

/** One clear, evidence-based next study action for the dashboard. */
export default function DailyMissionCard({
  href,
  subjectName,
  topicName,
  type,
  accuracy,
  scoreBoostDay,
}: Props) {
  const startMission = () => {
    // Quiz creation can take a minute, so preserve a short-lived anonymous
    // source marker in this browser only. QuizRunner consumes it once after a
    // real completion; it is never sent to the server or attached to a user.
    window.sessionStorage.setItem(
      "examgrind:active-mission",
      JSON.stringify({ type, startedAt: Date.now() }),
    );
    trackDailyMissionStarted({ mission_type: type });
  };
  const copy =
    type === "repair"
      ? {
          eyebrow: "Daily mission · today’s repair",
          title: `Strengthen ${topicName ?? subjectName}`,
          detail: `AI Coach: you reached ${accuracy}% here before. Let’s repair it with one short retry and make this a reliable topic.`,
          button: "Repair this topic",
        }
      : type === "foundation"
      ? {
          eyebrow: "Daily mission · today’s first step",
          title: `Start ${topicName ?? subjectName}`,
          detail: "AI Coach: one focused quiz is enough to give you a real starting point and personalise what comes next.",
          button: "Start today’s mission",
        }
      : type === "revision"
      ? {
          eyebrow: "Daily mission · revision due",
          title: `Recall ${topicName ?? subjectName}`,
          detail: "AI Coach: you have built this skill before. One short recall round now will help it stay reliable when the exam needs it.",
          button: "Start a recall round",
        }
      : {
          eyebrow: "Daily mission · today’s next step",
          title: `Build ${topicName ?? subjectName}`,
          detail: "AI Coach: keep your momentum with one focused practice session—no need to decide what to study next.",
          button: "Continue learning",
        };

  return (
    <section id="daily-mission" className="mx-auto mt-7 max-w-5xl scroll-mt-5 px-4 sm:px-6">
      <div className="overflow-hidden rounded-3xl border border-ember-600/20 bg-gradient-to-br from-cocoa-900 via-cocoa-900 to-ember-900 p-5 shadow-warm-lg sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-sun-300">
              {copy.eyebrow}
            </p>
            <h2 className="mt-2 font-serif text-2xl font-semibold text-cream-50 sm:text-3xl">
              {copy.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-cream-100/80 sm:text-base">
              {copy.detail}
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
          <Link
            href={href}
            onClick={startMission}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-sun-400 px-4 py-3 text-sm font-bold text-cocoa-900 shadow-warm transition hover:-translate-y-0.5 hover:bg-sun-300"
          >
            {copy.button} <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
