"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  trackMistakeBookViewed,
  trackMistakeTopicRetryStarted,
} from "@/lib/product-analytics";

export type Mistake = {
  id: string;
  question: string;
  userAnswer: "A" | "B" | "C" | "D";
  correctAnswer: "A" | "B" | "C" | "D";
  options: Record<"A" | "B" | "C" | "D", string>;
  subject: string;
  topic: string | null;
  topicId: string | null;
  resultId: string;
  createdAt: string;
};

type Period = "all" | "7" | "30";

export default function MistakeBook({ mistakes }: { mistakes: Mistake[] }) {
  const [subject, setSubject] = useState("all");
  const [period, setPeriod] = useState<Period>("all");

  useEffect(() => {
    trackMistakeBookViewed({ mistake_count: mistakes.length });
  }, [mistakes.length]);

  const subjects = useMemo(
    () => Array.from(new Set(mistakes.map((mistake) => mistake.subject))).sort(),
    [mistakes],
  );
  const filtered = useMemo(() => {
    const cutoff =
      period === "all" ? null : Date.now() - Number(period) * 86_400_000;
    return mistakes.filter((mistake) => {
      if (subject !== "all" && mistake.subject !== subject) return false;
      return cutoff == null || new Date(mistake.createdAt).getTime() >= cutoff;
    });
  }, [mistakes, period, subject]);

  if (mistakes.length === 0) {
    return (
      <div className="rounded-3xl border border-cocoa-900/[0.08] bg-cream-50 p-8 text-center shadow-warm sm:p-10">
        <p className="text-3xl" aria-hidden>📘</p>
        <h2 className="mt-3 font-serif text-2xl font-semibold text-cocoa-900">
          Your mistake book is clean.
        </h2>
        <p className="mt-2 text-sm leading-6 text-cocoa-700">
          Complete a quiz and any incorrect answers will appear here for focused revision.
        </p>
        <Link href="/home" className="mt-5 inline-flex rounded-2xl bg-cocoa-900 px-4 py-3 text-sm font-bold text-cream-50 transition hover:bg-cocoa-800">
          Choose a topic →
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-3xl border border-cocoa-900/[0.08] bg-cream-50 p-4 shadow-warm sm:flex sm:items-end sm:justify-between sm:gap-4 sm:p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cocoa-500">Revision queue</p>
          <p className="mt-1 font-serif text-xl font-semibold text-cocoa-900">
            {filtered.length} {filtered.length === 1 ? "mistake" : "mistakes"} to repair
          </p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 sm:mt-0">
          <select
            aria-label="Filter mistakes by subject"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            className="rounded-xl border border-cocoa-900/10 bg-white px-3 py-2 text-sm font-medium text-cocoa-900 outline-none focus:ring-2 focus:ring-ember-600/30"
          >
            <option value="all">All subjects</option>
            {subjects.map((name) => <option key={name} value={name}>{name}</option>)}
          </select>
          <select
            aria-label="Filter mistakes by date"
            value={period}
            onChange={(event) => setPeriod(event.target.value as Period)}
            className="rounded-xl border border-cocoa-900/10 bg-white px-3 py-2 text-sm font-medium text-cocoa-900 outline-none focus:ring-2 focus:ring-ember-600/30"
          >
            <option value="all">All time</option>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
          </select>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {filtered.map((mistake) => {
          const retryHref = mistake.topicId ? `/topic/${mistake.topicId}` : `/results/${mistake.resultId}`;
          return (
            <article key={mistake.id} className="rounded-3xl border border-cocoa-900/[0.08] bg-cream-50 p-5 shadow-warm sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cocoa-500">
                {mistake.subject}{mistake.topic ? ` · ${mistake.topic}` : ""}
              </p>
              <h2 className="mt-2 font-serif text-lg font-semibold leading-relaxed text-cocoa-900">
                {mistake.question}
              </h2>
              <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                <p className="rounded-xl bg-ember-600/10 px-3 py-2 text-ember-800">
                  Your answer: <span className="font-semibold">{mistake.userAnswer}. {mistake.options[mistake.userAnswer]}</span>
                </p>
                <p className="rounded-xl bg-sun-500/15 px-3 py-2 text-cocoa-900">
                  Correct answer: <span className="font-semibold">{mistake.correctAnswer}. {mistake.options[mistake.correctAnswer]}</span>
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <time className="text-xs text-cocoa-500" dateTime={mistake.createdAt}>
                  {new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(mistake.createdAt))}
                </time>
                <Link
                  href={retryHref}
                  onClick={() => mistake.topicId && trackMistakeTopicRetryStarted()}
                  className="rounded-xl bg-cocoa-900 px-3 py-2 text-xs font-bold text-cream-50 transition hover:bg-cocoa-800"
                >
                  {mistake.topicId ? "Retry this topic →" : "Open result →"}
                </Link>
              </div>
            </article>
          );
        })}
        {filtered.length === 0 && (
          <div className="rounded-3xl border border-dashed border-cocoa-900/20 bg-cream-50 p-8 text-center text-sm text-cocoa-700">
            No mistakes match those filters.
          </div>
        )}
      </div>
    </>
  );
}
