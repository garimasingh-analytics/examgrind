import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import ExamSwitcher from "@/components/ExamSwitcher";
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

      <section className="mx-auto max-w-3xl px-4 pt-4 sm:px-6 sm:pt-8">
        <p className="text-sm font-medium uppercase tracking-widest text-cocoa-500">
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
        <h1 className="mt-2 font-serif text-4xl font-semibold leading-tight tracking-tight text-cocoa-900 sm:text-5xl">
          {subject.name}
        </h1>
        <p className="mt-3 text-base text-cocoa-700">
          Pick a chapter to see its topics. {chapters.length} chapter{chapters.length === 1 ? "" : "s"}.
        </p>
      </section>

      <section className="mx-auto mt-10 max-w-3xl px-4 sm:px-6 space-y-10">
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
          <div className="rounded-3xl border border-cocoa-900/[0.08] bg-cream-50 p-8 text-center">
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
    <div>
      {label && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-cocoa-500">
          {label}
        </p>
      )}
      <div className="space-y-2">
        {chapters.map((c, i) => (
          <Link
            key={c.id}
            href={`/chapter/${c.id}`}
            className="group flex items-center gap-4 rounded-2xl border border-cocoa-900/[0.06] bg-cream-50 px-5 py-4 shadow-warm transition hover:-translate-y-0.5 hover:border-cocoa-900/[0.12] hover:bg-white hover:shadow-warm-lg"
          >
            <span className="font-mono text-xs text-cocoa-500 shrink-0 w-10">
              {c.cuet_unit ?? `Ch ${i + 1}`}
            </span>
            <h3 className="flex-1 font-serif text-base font-semibold leading-snug text-cocoa-900">
              {c.name}
            </h3>
            <span className="text-cocoa-500 transition group-hover:translate-x-1 group-hover:text-cocoa-900">
              →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
