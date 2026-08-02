"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { trackStudyPlanSaved } from "@/lib/product-analytics";

type Subject = { id: string; name: string; icon: string | null };

type Props = {
  examSlug: string;
  examName: string;
  subjects: Subject[];
  initialSubjectIds: string[];
  initialTargetExamDate: string | null;
  initialTargetScore: string | null;
  initialDailyStudyMinutes: number | null;
  needsSetup: boolean;
};

export default function StudyPlanSetup({
  examSlug,
  examName,
  subjects,
  initialSubjectIds,
  initialTargetExamDate,
  initialTargetScore,
  initialDailyStudyMinutes,
  needsSetup,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(needsSetup);
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSubjectIds);
  const [targetExamDate, setTargetExamDate] = useState(initialTargetExamDate ?? "");
  const [targetScore, setTargetScore] = useState(initialTargetScore ?? "");
  const [dailyStudyMinutes, setDailyStudyMinutes] = useState(initialDailyStudyMinutes ?? 60);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const selectedCount = selectedIds.length;
  const summary = useMemo(() => {
    if (selectedCount === 0) return "Choose the papers you will actually sit.";
    return `${selectedCount} ${selectedCount === 1 ? "subject" : "subjects"} selected · ${dailyStudyMinutes} min/day`;
  }, [dailyStudyMinutes, selectedCount]);

  const toggleSubject = (id: string) => {
    setError("");
    setSelectedIds((current) => current.includes(id)
      ? current.filter((value) => value !== id)
      : current.length < 12 ? [...current, id] : current,
    );
  };

  const save = async () => {
    if (selectedIds.length === 0) {
      setError("Choose at least one subject.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/me/study-profile", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ examSlug, subjectIds: selectedIds, targetExamDate, targetScore, dailyStudyMinutes }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Couldn't save your study plan.");
      trackStudyPlanSaved({ exam: examSlug, subject_count: selectedIds.length, daily_minutes: dailyStudyMinutes });
      setOpen(false);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Couldn't save your study plan.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {!needsSetup && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full border border-cocoa-900/[0.1] bg-cream-50 px-3 py-1.5 text-xs font-bold text-cocoa-700 shadow-warm transition hover:bg-white"
        >
          Edit study plan
        </button>
      )}
      {open && (
        <div className="fixed inset-0 z-[70] overflow-y-auto bg-cocoa-950/55 px-4 py-6 backdrop-blur-sm sm:py-10">
          <section role="dialog" aria-modal="true" aria-labelledby="study-plan-title" className="mx-auto max-w-2xl rounded-[2rem] border border-cocoa-900/10 bg-cream-50 p-5 shadow-2xl sm:p-7">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-ember-700">Make ExamGrind yours</p>
            <h2 id="study-plan-title" className="mt-2 font-serif text-3xl font-semibold text-cocoa-900">Your {examName} study plan</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-cocoa-700">We will use this to show only your subjects, calculate an honest readiness signal, and build each daily mission.</p>

            <fieldset className="mt-6">
              <legend className="text-sm font-bold text-cocoa-900">Which papers are you preparing for?</legend>
              <p className="mt-1 text-xs text-cocoa-500">{summary}</p>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {subjects.map((subject) => {
                  const selected = selectedIds.includes(subject.id);
                  return <button key={subject.id} type="button" onClick={() => toggleSubject(subject.id)} className={`rounded-2xl border p-3 text-left text-sm font-semibold transition ${selected ? "border-ember-600 bg-ember-600 text-cream-50 shadow-warm" : "border-cocoa-900/[0.08] bg-cream-100 text-cocoa-700 hover:bg-white"}`} aria-pressed={selected}>
                    <span className="mr-1.5" aria-hidden>{subject.icon ?? "📚"}</span>{subject.name}
                  </button>;
                })}
              </div>
            </fieldset>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <label className="block text-sm font-bold text-cocoa-900">Exam date<input type="date" value={targetExamDate} onChange={(event) => setTargetExamDate(event.target.value)} className="mt-2 w-full rounded-xl border border-cocoa-900/[0.12] bg-white px-3 py-2 text-sm font-medium text-cocoa-900" /></label>
              <label className="block text-sm font-bold text-cocoa-900">Target score / rank<input type="text" maxLength={60} value={targetScore} onChange={(event) => setTargetScore(event.target.value)} placeholder="e.g. 720 / 99 percentile" className="mt-2 w-full rounded-xl border border-cocoa-900/[0.12] bg-white px-3 py-2 text-sm font-medium text-cocoa-900 placeholder:text-cocoa-400" /></label>
              <label className="block text-sm font-bold text-cocoa-900">Study time<select value={dailyStudyMinutes} onChange={(event) => setDailyStudyMinutes(Number(event.target.value))} className="mt-2 w-full rounded-xl border border-cocoa-900/[0.12] bg-white px-3 py-2 text-sm font-medium text-cocoa-900"><option value={30}>30 min/day</option><option value={45}>45 min/day</option><option value={60}>1 hr/day</option><option value={90}>1.5 hr/day</option><option value={120}>2 hr/day</option><option value={180}>3 hr/day</option></select></label>
            </div>
            {error && <p role="alert" className="mt-4 rounded-xl bg-coral-500/10 px-3 py-2 text-sm font-semibold text-ember-800">{error}</p>}
            <div className="mt-7 flex flex-wrap justify-end gap-3">
              {!needsSetup && <button type="button" onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-sm font-bold text-cocoa-600 hover:bg-cream-200">Cancel</button>}
              <button type="button" disabled={saving} onClick={save} className="rounded-2xl bg-cocoa-900 px-5 py-3 text-sm font-bold text-cream-50 shadow-warm transition hover:bg-cocoa-800 disabled:cursor-wait disabled:opacity-70">{saving ? "Saving your plan…" : "Build my plan →"}</button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
