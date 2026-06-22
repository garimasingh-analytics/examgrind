"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Chick from "@/components/Chick";
import type { DiagnoseExam } from "@/lib/diagnose-questions";

type PublicQuestion = {
  id: string;
  question: string;
  options: { A: string; B: string; C: string; D: string };
};

type GradeResult = {
  score: number;
  total: number;
  perQuestion: Array<{
    id: string;
    question: string;
    picked: "A" | "B" | "C" | "D" | null;
    correct: "A" | "B" | "C" | "D";
    isCorrect: boolean;
    concept: string;
    drill: string;
    whenWrong: string;
    optionLabels: { A: string; B: string; C: string; D: string };
  }>;
  narrative: string;
};

type Props = {
  exam: DiagnoseExam;
  examLabel: string;
  tagline: string;
  questions: PublicQuestion[];
};

type Choice = "A" | "B" | "C" | "D" | null;
type Phase = "intro" | "running" | "submitting" | "result";

const TOTAL_SECONDS = 90;

export default function DiagnoseRunner({ exam, examLabel, tagline, questions }: Props) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [answers, setAnswers] = useState<Choice[]>(() => questions.map(() => null));
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [activeIndex, setActiveIndex] = useState(0);
  const [result, setResult] = useState<GradeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const submitOnceRef = useRef(false);

  useEffect(() => {
    if (phase !== "running") return;
    if (secondsLeft <= 0) {
      void submit();
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, secondsLeft]);

  async function submit() {
    if (submitOnceRef.current) return;
    submitOnceRef.current = true;
    setPhase("submitting");
    setError(null);
    try {
      const r = await fetch("/api/diagnose/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exam,
          answers: questions.map((q, i) => ({ id: q.id, picked: answers[i] })),
        }),
      });
      if (!r.ok) throw new Error(`Server returned ${r.status}`);
      const data = (await r.json()) as GradeResult;
      setResult(data);
      setPhase("result");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Something went wrong grading your answers. Try again."
      );
      setPhase("running");
      submitOnceRef.current = false;
    }
  }

  if (phase === "intro") {
    return (
      <section className="mx-auto flex max-w-2xl flex-col items-center px-6 py-10 text-center">
        <Chick state="idle" size={120} className="mb-6" />
        <p className="mb-3 inline-flex items-center rounded-full bg-cocoa-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cream-50">
          {examLabel} · 5 questions · 90 seconds
        </p>
        <h1 className="text-balance font-serif text-4xl font-semibold leading-[1.1] text-cocoa-900 sm:text-5xl">
          {tagline}
        </h1>
        <p className="mt-4 max-w-md text-cocoa-700">
          Real PYQ traps. Pick the best option. The AI will tell you which concept you got wrong and where to drill.
        </p>
        <button
          onClick={() => setPhase("running")}
          className="mt-8 inline-flex items-center justify-center rounded-2xl bg-cocoa-900 px-8 py-3.5 text-base font-bold text-cream-50 shadow-warm transition hover:bg-cocoa-700"
        >
          Start the 90-second diagnosis →
        </button>
        <p className="mt-3 text-xs text-cocoa-500">No signup. We don&apos;t track or save your answers unless you choose to sign up at the end.</p>
      </section>
    );
  }

  if (phase === "result" && result) {
    return <DiagnoseResult result={result} exam={exam} examLabel={examLabel} />;
  }

  if (phase === "submitting") {
    return (
      <section className="mx-auto flex max-w-2xl flex-col items-center px-6 py-20 text-center">
        <Chick state="happy" size={120} className="mb-6 animate-pulse" />
        <p className="font-serif text-2xl font-bold text-cocoa-900">Grading your answers…</p>
        <p className="mt-2 text-cocoa-500">5 seconds.</p>
      </section>
    );
  }

  const q = questions[activeIndex];
  const picked = answers[activeIndex];
  const allPicked = answers.every((a) => a !== null);
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeWarning = secondsLeft <= 15;

  return (
    <section className="mx-auto flex max-w-2xl flex-col px-6 py-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm font-semibold text-cocoa-700">
          Question {activeIndex + 1} of {questions.length}
        </div>
        <div
          className={`rounded-full px-3 py-1 text-sm font-bold tabular-nums ${
            timeWarning ? "bg-coral-500/15 text-coral-700" : "bg-cocoa-900/[0.06] text-cocoa-700"
          }`}
        >
          {minutes}:{seconds.toString().padStart(2, "0")}
        </div>
      </div>

      <div className="mb-6 flex gap-1.5">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              answers[i] !== null
                ? "bg-cocoa-900"
                : i === activeIndex
                  ? "bg-coral-500"
                  : "bg-cocoa-900/[0.10]"
            }`}
          />
        ))}
      </div>

      <div className="rounded-3xl border border-cocoa-900/[0.06] bg-cream-50 p-6 shadow-warm">
        <p className="font-serif text-xl font-semibold leading-snug text-cocoa-900 sm:text-2xl">
          {q.question}
        </p>

        <ul className="mt-5 grid gap-3">
          {(["A", "B", "C", "D"] as const).map((letter) => {
            const isPicked = picked === letter;
            return (
              <li key={letter}>
                <button
                  onClick={() => {
                    const next = [...answers];
                    next[activeIndex] = letter;
                    setAnswers(next);
                  }}
                  className={`flex w-full items-start gap-3 rounded-2xl border-2 px-4 py-3 text-left transition ${
                    isPicked
                      ? "border-coral-500 bg-coral-500/10"
                      : "border-cocoa-900/[0.08] bg-cream-50 hover:border-cocoa-900/30"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      isPicked
                        ? "bg-coral-500 text-cream-50"
                        : "bg-cocoa-900/[0.08] text-cocoa-700"
                    }`}
                  >
                    {letter}
                  </span>
                  <span className="leading-snug text-cocoa-900">{q.options[letter]}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {error && (
        <p className="mt-4 rounded-xl bg-coral-500/10 px-4 py-3 text-sm text-coral-700">{error}</p>
      )}

      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
          disabled={activeIndex === 0}
          className="rounded-xl px-4 py-2 text-sm font-semibold text-cocoa-700 transition hover:bg-cocoa-900/[0.06] disabled:opacity-30"
        >
          ← Back
        </button>
        {activeIndex < questions.length - 1 ? (
          <button
            onClick={() => setActiveIndex((i) => Math.min(questions.length - 1, i + 1))}
            disabled={!picked}
            className="rounded-2xl bg-cocoa-900 px-6 py-2.5 text-sm font-bold text-cream-50 shadow-warm transition hover:bg-cocoa-700 disabled:bg-cocoa-900/30"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={submit}
            disabled={!allPicked}
            className="rounded-2xl bg-coral-500 px-6 py-2.5 text-sm font-bold text-cream-50 shadow-warm transition hover:bg-coral-600 disabled:bg-cocoa-900/30"
          >
            Get my diagnosis →
          </button>
        )}
      </div>
    </section>
  );
}

function DiagnoseResult({
  result,
  exam,
  examLabel,
}: {
  result: GradeResult;
  exam: DiagnoseExam;
  examLabel: string;
}) {
  const wrongCount = result.total - result.score;
  const examStartHref = `/start/${exam === "neet-ug" ? "neet-ug" : exam}`;

  return (
    <section className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-6 flex flex-col items-center text-center">
        <Chick state={result.score >= 4 ? "happy" : "idle"} size={96} className="mb-4" />
        <p className="text-sm font-semibold uppercase tracking-wide text-cocoa-500">
          Your {examLabel} diagnosis
        </p>
        <p className="mt-1 font-serif text-5xl font-bold text-cocoa-900">
          {result.score} / {result.total}
        </p>
        <p className="mt-2 max-w-md text-balance text-cocoa-700">
          {result.narrative}
        </p>
      </div>

      <div className="space-y-4">
        {result.perQuestion.map((row, i) => (
          <details
            key={row.id}
            open={!row.isCorrect}
            className={`rounded-2xl border p-4 ${
              row.isCorrect
                ? "border-cocoa-900/[0.06] bg-cream-50"
                : "border-coral-500/30 bg-coral-500/[0.06]"
            }`}
          >
            <summary className="flex cursor-pointer items-start gap-3 list-none">
              <span
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  row.isCorrect ? "bg-emerald-500 text-cream-50" : "bg-coral-500 text-cream-50"
                }`}
              >
                {row.isCorrect ? "✓" : "✕"}
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-cocoa-900">
                  Q{i + 1}. {row.question}
                </p>
                <p className="mt-1 text-xs font-medium text-cocoa-500">
                  Concept: {row.concept}
                </p>
              </div>
            </summary>
            <div className="mt-3 space-y-2 pl-9 text-sm text-cocoa-700">
              {row.picked && !row.isCorrect && (
                <p>
                  <strong className="text-coral-700">You picked ({row.picked}):</strong>{" "}
                  {row.optionLabels[row.picked]}
                </p>
              )}
              <p>
                <strong className="text-emerald-700">Correct ({row.correct}):</strong>{" "}
                {row.optionLabels[row.correct]}
              </p>
              {!row.isCorrect && (
                <>
                  <p className="rounded-xl bg-cream-50/60 p-3">{row.whenWrong}</p>
                  <p className="text-xs font-semibold text-cocoa-900">
                    📚 Drill: {row.drill}
                  </p>
                </>
              )}
            </div>
          </details>
        ))}
      </div>

      <div className="mt-10 rounded-3xl border-2 border-cocoa-900 bg-cocoa-900 p-6 text-cream-50 shadow-warm">
        <p className="text-xs font-semibold uppercase tracking-wide text-cream-50/70">
          You just found {wrongCount > 0 ? `${wrongCount} concept gap${wrongCount === 1 ? "" : "s"}` : "no gaps yet"}
        </p>
        <h2 className="mt-2 font-serif text-2xl font-bold leading-tight">
          {wrongCount > 0
            ? `Run the full 30-question diagnostic. Free.`
            : `Try a real chapter quiz. Free.`}
        </h2>
        <p className="mt-2 text-sm text-cream-50/80">
          {wrongCount > 0
            ? `30 questions across the full ${examLabel} syllabus. Concept-level weakness map. Personalized 7-day drill plan. No card.`
            : `Pick a chapter, take a 10-question quiz. AI catches the traps you'd miss.`}
        </p>
        <Link
          href={examStartHref}
          className="mt-4 inline-flex items-center justify-center rounded-2xl bg-cream-50 px-6 py-3 text-base font-bold text-cocoa-900 transition hover:bg-cream-100"
        >
          Sign up free →
        </Link>
        <p className="mt-3 text-xs text-cream-50/60">
          3 free quizzes + 1 free mock + 1 free Deep Analysis · ₹199/month after · cancel anytime
        </p>
      </div>

      <div className="mt-6 text-center text-sm text-cocoa-500">
        Friend grinding for {examLabel}? Send them the link →{" "}
        <span className="font-mono text-cocoa-700">examgrind.in/diagnose</span>
      </div>
    </section>
  );
}
