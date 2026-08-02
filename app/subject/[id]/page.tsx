import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import ExamSwitcher from "@/components/ExamSwitcher";
import Chick from "@/components/Chick";
import type { Subject, Chapter } from "@/lib/types";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export default async function SubjectPage({ params }: Params) {
  const { id } = await params;
  const supabase = createServerSupabase();

  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) redirect("/");

  // PERFORMANCE: profile / subject / chapters are all independent — fire
  // them in parallel instead of three sequential awaits.
  const [profileRes, subjectRes, chaptersRes] = await Promise.all([
    supabase
      .from("users")
      .select("exam_choice")
      .eq("id", authUser.id)
      .maybeSingle<{ exam_choice: string | null }>(),
    supabase.from("subjects").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("chapters")
      .select("*")
      .eq("subject_id", id)
      .order("order_index", { ascending: true }),
  ]);

  const examSlug = profileRes.data?.exam_choice ?? "cuet";
  if (!subjectRes.data) notFound();
  const subject = subjectRes.data as Subject;
  const chapters = (chaptersRes.data ?? []) as Chapter[];

  // Group chapters by NCERT class for cleaner browsing.
  const class11 = chapters.filter((c) => c.ncert_class === 11);
  const class12 = chapters.filter((c) => c.ncert_class === 12);
  const other   = chapters.filter((c) => c.ncert_class == null);

  return (
    <main className="bg-warm-wash min-h-[100svh] pb-20">
      <header className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/home" className="font-serif text-lg font-bold text-cocoa-900 sm:text-xl">
            ExamGrind
          </Link>
          <ExamSwitcher currentSlug={examSlug} />
        </div>
        <Link href="/home" className="truncate text-sm font-medium text-cocoa-500 hover:text-cocoa-900">
          ← All subjects
        </Link>
      </header>

      <section className="subject-cover mx-auto max-w-3xl px-4 pt-4 sm:px-6 sm:pt-8">
        <div className="subject-cover-inner">
        <div className="relative z-10 max-w-xl">
        <p className="eg-kicker text-sun-400">
          {/* Header crumb: CUET keeps cuet_code (e.g. 'CUET-301'); SSC/NEET */}
          {/* fall back to the exam name so it never reads as a generic       */}
          {/* 'Subject' label.                                                */}
          {subject.cuet_code ??
            (examSlug === "ssc-cgl"
              ? "SSC CGL"
              : examSlug === "neet-ug"
              ? "NEET UG"
              : "Subject")}
        </p>
        <h1 className="mt-2 font-serif text-4xl font-semibold leading-[.9] tracking-[-.055em] text-cream-50 sm:text-6xl">
          {subject.name}
        </h1>
        <p className="mt-4 max-w-md text-base leading-6 text-cream-200">
          Your field guide has {chapters.length} chapter{chapters.length === 1 ? "" : "s"}. Pick a page, find the concept, and make your next mark count.
        </p>
        <div className="mt-7 flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-[.13em] text-cream-50"><span className="rounded-full border border-cream-50/20 bg-cream-50/10 px-3 py-2">{chapters.length} chapters</span><span className="rounded-full border border-cream-50/20 bg-cream-50/10 px-3 py-2">Choose a chapter ↓</span></div>
        </div>
        <div className="subject-cover-chick"><Chick state="idle" size={106} /></div><span className="subject-cover-orbit" aria-hidden>✦</span><span className="subject-cover-squiggle" aria-hidden>⌁</span>
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-3xl px-4 sm:px-6 space-y-8">
        {/* NCERT-tagged exams (CUET, NEET UG) get class-grouped chapters;  */}
        {/* exams without NCERT tagging (SSC CGL) just show a flat list — */}
        {/* a single 'Sections' header would feel redundant.                  */}
        {class11.length > 0 && <ChapterGroup label="Class 11" chapters={class11} />}
        {class12.length > 0 && <ChapterGroup label="Class 12" chapters={class12} />}
        {other.length > 0 && (
          class11.length + class12.length > 0 ? (
            <ChapterGroup label="Sections" chapters={other} />
          ) : (
            <ChapterGroup label={null} chapters={other} />
          )
        )}

        {chapters.length === 0 && (
          <div className="rounded-3xl border border-cocoa-900/[0.08] bg-cream-50 p-8 text-center shadow-warm">
            <p className="text-cocoa-700">
              No chapters seeded for this subject yet. Coming soon.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

function ChapterGroup({
  label,
  chapters,
}: {
  label: string | null;
  chapters: Chapter[];
}) {
  return (
    <div className="chapter-section">
      {label && (
        <div className="chapter-divider"><p className="eg-kicker">{label}</p><span aria-hidden>✦</span></div>
      )}
      <div className="chapter-stack">
        {chapters.map((c, i) => (
          <Link
            key={c.id}
            href={`/chapter/${c.id}`}
            className={`chapter-slip chapter-slip-${i % 3}`}
          >
            <span className="chapter-number">
              {c.cuet_unit ?? `Ch ${i + 1}`}
            </span>
            <span className="flex-1"><span className="block font-serif text-lg font-semibold leading-snug text-cocoa-900">
              {c.name}
            </span><span className="mt-1 block text-xs text-cocoa-700">Open chapter · choose a topic</span></span>
            <span className="chapter-arrow" aria-hidden>→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
