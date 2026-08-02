"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { trackStudyPlanSaved } from "@/lib/product-analytics";
import Chick from "@/components/Chick";

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
  forceOpen?: boolean;
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
  forceOpen = false,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(needsSetup || forceOpen);
  const [step, setStep] = useState(0);
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
      : [...current, id],
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
          onClick={() => { setStep(0); setOpen(true); }}
          className="rounded-full border border-cocoa-900/[0.1] bg-cream-50 px-3 py-1.5 text-xs font-bold text-cocoa-700 shadow-warm transition hover:bg-white"
        >
          Edit study plan
        </button>
      )}
      {open && (
        <div className="onboarding-backdrop fixed inset-0 z-[100] overflow-y-auto px-4 py-6 sm:py-10" style={{ backgroundColor: "#1D1815" }}>
          <section role="dialog" aria-modal="true" aria-labelledby="study-plan-title" className="onboarding-sheet mx-auto max-w-2xl">
            <div className="onboarding-top"><span className="eg-kicker text-sun-400">ExamGrind · your study story</span><div className="onboarding-steps" aria-label={`Step ${step + 1} of 3`}><span className={step >= 0 ? "is-active" : ""} /><span className={step >= 1 ? "is-active" : ""} /><span className={step >= 2 ? "is-active" : ""} /></div></div>

            {step === 0 && <div className="onboarding-welcome"><div className="onboarding-orbit" aria-hidden>✦</div><Chick state="excited" size={136} className="relative z-10" /><p className="relative z-10 eg-kicker text-ember-700">First, a little direction</p><h2 id="study-plan-title" className="relative z-10 mt-2 max-w-lg font-serif text-4xl font-semibold leading-[.9] tracking-[-.06em] text-cocoa-900 sm:text-5xl">Let&apos;s make {examName} feel possible.</h2><p className="relative z-10 mt-4 max-w-lg text-sm leading-6 text-cocoa-700">In two quick choices, your Home becomes a personal field guide: only your subjects, a truthful countdown, and missions that fit your day.</p><div className="relative z-10 mt-7 flex flex-wrap gap-2 text-xs font-bold text-cocoa-700"><span className="rounded-full border border-cocoa-900/10 bg-cream-50 px-3 py-2">No generic timetable</span><span className="rounded-full border border-cocoa-900/10 bg-cream-50 px-3 py-2">Change it anytime</span></div></div>}

            {step === 1 && <div className="onboarding-page"><p className="eg-kicker text-ember-700">Part one · your papers</p><h2 id="study-plan-title" className="mt-2 font-serif text-3xl font-semibold leading-[.94] tracking-[-.05em] text-cocoa-900">What are you actually preparing for?</h2><p className="mt-3 text-sm leading-6 text-cocoa-700">Choose only the subjects you will sit. We will never show your readiness against somebody else&apos;s syllabus.</p><fieldset className="mt-6"><legend className="sr-only">Choose subjects</legend><p className="mb-3 text-xs font-bold text-cocoa-600">{summary}</p><div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{subjects.map((subject) => { const selected = selectedIds.includes(subject.id); return <button key={subject.id} type="button" onClick={() => toggleSubject(subject.id)} className={`onboarding-subject ${selected ? "is-selected" : ""}`} aria-pressed={selected}><span className="text-lg" aria-hidden>{subject.icon ?? "📚"}</span><span>{subject.name}</span><span className="onboarding-check" aria-hidden>{selected ? "✓" : "+"}</span></button>; })}</div></fieldset></div>}

            {step === 2 && <div className="onboarding-page"><p className="eg-kicker text-ember-700">Part two · your rhythm</p><h2 id="study-plan-title" className="mt-2 font-serif text-3xl font-semibold leading-[.94] tracking-[-.05em] text-cocoa-900">Give your preparation a horizon.</h2><p className="mt-3 text-sm leading-6 text-cocoa-700">These are flexible. They help the coach make your countdown and daily mission honest—not impossible.</p><div className="mt-6 grid gap-4 sm:grid-cols-3"><label className="onboarding-field">Exam date<input type="date" value={targetExamDate} onChange={(event) => setTargetExamDate(event.target.value)} /></label><label className="onboarding-field">Target score / rank<input type="text" maxLength={60} value={targetScore} onChange={(event) => setTargetScore(event.target.value)} placeholder="e.g. 720 / 99 percentile" /></label><label className="onboarding-field">Study time<select value={dailyStudyMinutes} onChange={(event) => setDailyStudyMinutes(Number(event.target.value))}><option value={30}>30 min/day</option><option value={45}>45 min/day</option><option value={60}>1 hr/day</option><option value={90}>1.5 hr/day</option><option value={120}>2 hr/day</option><option value={180}>3 hr/day</option><option value={240}>4 hr/day</option><option value={300}>5 hr/day</option><option value={360}>6 hr/day</option><option value={420}>7 hr/day</option><option value={480}>8 hr/day</option><option value={540}>9 hr/day</option><option value={600}>10 hr/day</option><option value={660}>11 hr/day</option><option value={720}>12 hr/day</option><option value={780}>13 hr/day</option><option value={840}>14 hr/day</option></select></label></div><div className="mt-6 rounded-2xl border border-violet-500/20 bg-violet-500/10 px-4 py-3 text-sm leading-5 text-cocoa-700"><span className="font-bold text-cocoa-900">Your plan will include:</span> a focused daily mission, your selected-subject readiness signal, and a revision rhythm that adapts as you practice.</div></div>}

            {error && <p role="alert" className="mx-6 mt-1 rounded-xl bg-coral-500/10 px-3 py-2 text-sm font-semibold text-ember-800">{error}</p>}
            <div className="onboarding-actions">{step > 0 ? <button type="button" onClick={() => setStep((current) => current - 1)} className="onboarding-back">← Back</button> : !needsSetup ? <button type="button" onClick={() => setOpen(false)} className="onboarding-back">Not now</button> : <span />}{step < 2 ? <button type="button" onClick={() => { if (step === 1 && selectedIds.length === 0) { setError("Choose at least one subject."); return; } setError(""); setStep((current) => current + 1); }} className="onboarding-next">{step === 0 ? "Set my direction →" : "Set my rhythm →"}</button> : <button type="button" disabled={saving} onClick={save} className="onboarding-next">{saving ? "Building your plan…" : "Open my study guide →"}</button>}</div>
          </section>
        </div>
      )}
    </>
  );
}
