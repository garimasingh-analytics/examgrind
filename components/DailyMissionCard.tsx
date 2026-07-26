"use client";

import Link from "next/link";
import { trackDailyMissionStarted } from "@/lib/product-analytics";

type Props = {
  href: string;
  subjectName: string;
  topicName: string | null;
  type: "foundation" | "repair" | "advance";
  accuracy: number | null;
};

/** One clear, evidence-based next study action for the dashboard. */
export default function DailyMissionCard({
  href,
  subjectName,
  topicName,
  type,
  accuracy,
}: Props) {
  const copy =
    type === "repair"
      ? {
          eyebrow: "Today’s repair",
          title: `Strengthen ${topicName ?? subjectName}`,
          detail: `Your best accuracy was ${accuracy}%. A short retry can turn this into a reliable topic.`,
          button: "Repair this topic",
        }
      : type === "foundation"
      ? {
          eyebrow: "Today’s first step",
          title: `Start ${topicName ?? subjectName}`,
          detail: "One focused quiz is enough to create a useful starting point for your study plan.",
          button: "Start today’s mission",
        }
      : {
          eyebrow: "Today’s next step",
          title: `Build ${topicName ?? subjectName}`,
          detail: "Keep your momentum with one focused practice session.",
          button: "Continue learning",
        };

  return (
    <section className="mx-auto mt-7 max-w-5xl px-4 sm:px-6">
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
          </div>
          <Link
            href={href}
            onClick={() => trackDailyMissionStarted({ mission_type: type })}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-sun-400 px-4 py-3 text-sm font-bold text-cocoa-900 shadow-warm transition hover:-translate-y-0.5 hover:bg-sun-300"
          >
            {copy.button} <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
