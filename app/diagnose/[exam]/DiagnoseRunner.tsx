"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Chick from "@/components/Chick";
import type { DiagnoseExam } from "@/lib/diagnose-questions";
import {
  trackDiagnosisCompleted,
  trackDiagnosisQuestionAnswered,
  trackDiagnosisResultViewed,
  trackDiagnosisSignupClicked,
  trackDiagnosisStarted,
} from "@/lib/product-analytics";
import { trackMetaDiagnosisLead } from "@/lib/meta-ads";

type PublicQuestion = {
  id: string;
  subjectId: string;
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
    subjectId: string;
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
  const startedAtRef = useRef<number | null>(null);
  const answeredQuestionIndexesRef = useRef(new Set<number>());

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
      trackDiagnosisCompleted({
        exam,
        question_count: questions.length,
        answered_count: answers.filter((answer) => answer !== null).length,
        correct_count: data.score,
        duration_seconds: startedAtRef.current
          ? Math.max(0, Math.round((Date.now() - startedAtRef.current) / 1000))
          : TOTAL_SECONDS - secondsLeft,
      });
      // This is deliberately after a successful server-side grade: opening
      // the diagnosis or answering one question is not a conversion.
      trackMetaDiagnosisLead(exam);
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
          Five focused exam-style questions. Pick the best option. ExamGrind will show the concepts this sample says to revise first.
        </p>
        <button
          onClick={() => {
            startedAtRef.current = Date.now();
            trackDiagnosisStarted({ exam, question_count: questions.length });
            setPhase("running");
          }}
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
                    if (!answeredQuestionIndexesRef.current.has(activeIndex)) {
                      answeredQuestionIndexesRef.current.add(activeIndex);
                      trackDiagnosisQuestionAnswered({
                        exam,
                        question_number: activeIndex + 1,
                      });
                    }
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
  const missed = result.perQuestion.filter((row) => !row.isCorrect);
  const firstPriority = missed[0] ?? null;
  const correctConcepts = result.perQuestion
    .filter((row) => row.isCorrect)
    .map((row) => row.concept);
  const examStartHref = `/start/${exam === "neet-ug" ? "neet-ug" : exam}`;

  const carrySignalIntoHome = () => {
    if (!firstPriority) return;
    try {
      window.localStorage.setItem("examgrind:public-diagnosis-handoff", JSON.stringify({
        exam,
        concept: firstPriority.concept,
        subjectId: firstPriority.subjectId,
        wrongCount,
        createdAt: Date.now(),
      }));
    } catch {
      // Storage is optional. The sign-up journey remains usable in strict
      // privacy modes; it simply lands on the normal personalised Home.
    }
  };

  const rememberDiagnosisSignupIntent = () => {
    try {
      // Survives an OAuth round-trip only long enough to distinguish a
      // diagnosis-led signup. It never contains answers or identity data.
      window.sessionStorage.setItem("examgrind:diagnosis-signup-intent", JSON.stringify({
        exam,
        createdAt: Date.now(),
      }));
    } catch {
      // Attribution is optional; sign-up must never depend on browser storage.
    }
  };

  useEffect(() => {
    trackDiagnosisResultViewed({
      exam,
      score_band: result.score <= 1 ? "0_1" : result.score <= 3 ? "2_3" : "4_5",
    });
  }, [exam, result.score]);

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

      <div className="rounded-3xl border border-coral-500/25 bg-coral-500/[0.07] p-5 shadow-warm">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-coral-700">Your clearest next move</p>
        {firstPriority ? (
          <>
            <h2 className="mt-2 font-serif text-2xl font-bold leading-tight text-cocoa-900">Repair {firstPriority.concept} first.</h2>
            <p className="mt-2 text-sm leading-6 text-cocoa-700">{firstPriority.whenWrong}</p>
            <div className="mt-4 rounded-2xl bg-cream-50 px-4 py-3 text-sm text-cocoa-700"><span className="font-bold text-cocoa-900">Start here:</span> {firstPriority.drill}</div>
          </>
        ) : (
          <>
            <h2 className="mt-2 font-serif text-2xl font-bold leading-tight text-cocoa-900">This sample did not expose a gap.</h2>
            <p className="mt-2 text-sm leading-6 text-cocoa-700">That is a strong start, not a full assessment. Use chapter practice to find the concepts this five-question sample did not touch.</p>
          </>
        )}
      </div>

      <div className="mt-5 rounded-3xl border border-cocoa-900/[0.08] bg-cream-50 p-5">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-cocoa-500">What this quick signal means</p>
        <p className="mt-2 text-sm leading-6 text-cocoa-700">It surfaced {wrongCount === 0 ? "no gaps in this small sample" : `${wrongCount} concept gap${wrongCount === 1 ? "" : "s"}`} — useful direction, not a verdict on your full preparation. A real chapter attempt gives ExamGrind enough evidence for a deeper diagnosis.</p>
        {correctConcepts.length > 0 && <p className="mt-3 text-sm text-cocoa-700"><span className="font-bold text-cocoa-900">Held up here:</span> {correctConcepts.join(" · ")}</p>}
      </div>

      <div className="mt-5 rounded-3xl border-2 border-cocoa-900 bg-cocoa-900 p-6 text-cream-50 shadow-warm">
        <p className="text-xs font-semibold uppercase tracking-wide text-cream-50/70">Your next honest step</p>
        <h2 className="mt-2 font-serif text-2xl font-bold leading-tight">Create your free preparation space.</h2>
        <p className="mt-2 text-sm text-cream-50/80">Keep your exam choice, start three free chapter quizzes, and get a deeper concept-level analysis after a real attempt.</p>
        <Link
          href={examStartHref}
          onClick={() => {
            carrySignalIntoHome();
            rememberDiagnosisSignupIntent();
            trackDiagnosisSignupClicked({
              exam,
              next_step: "free_plan",
            });
          }}
          className="mt-4 inline-flex items-center justify-center rounded-2xl bg-cream-50 px-6 py-3 text-base font-bold text-cocoa-900 transition hover:bg-cream-100"
        >
          Create my free study plan →
        </Link>
        <p className="mt-3 text-xs text-cream-50/60">No card · 3 free chapter quizzes · one free Deep Analysis</p>
      </div>

      <details className="mt-6 rounded-3xl border border-cocoa-900/[0.08] bg-cream-50 p-5">
        <summary className="cursor-pointer text-sm font-bold text-cocoa-900">See the answer-by-answer evidence</summary>
        <div className="mt-4 space-y-4">
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
      </details>

      <div className="mt-6 text-center text-sm text-cocoa-500">
        Friend grinding for {examLabel}? Send them the link →{" "}
        <span className="font-mono text-cocoa-700">examgrind.in/diagnose</span>
      </div>
    </section>
  );
}
