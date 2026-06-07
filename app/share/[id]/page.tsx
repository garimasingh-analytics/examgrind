import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createAdminSupabase } from "@/lib/supabase/admin";
import Chick from "@/components/Chick";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

async function loadQuiz(id: string) {
  // Use the SERVICE-ROLE admin client because share pages must work for
  // visitors who aren't signed in (and we explicitly DON'T have a public-
  // read RLS policy on quizzes — that would expose every user's quiz
  // metadata via UUID enumeration). We only select non-PII fields here:
  // score, subject, subtopic — no user_id, no email, no answer choices.
  // If we ever add private columns to quizzes, narrow this select.
  const supabase = createAdminSupabase();
  const { data } = await supabase
    .from("quizzes")
    .select("id, subject, subtopic, score, created_at, topic_id")
    .eq("id", id)
    .maybeSingle();
  if (!data || data.score == null) return null;

  // Pull the total question count for this quiz.
  const { count } = await supabase
    .from("questions")
    .select("id", { count: "exact", head: true })
    .eq("quiz_id", id);

  return {
    ...data,
    total: count ?? 0,
  };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const quiz = await loadQuiz(id);
  if (!quiz) return { title: "ExamGrind" };

  const accuracy = quiz.total > 0
    ? Math.round((quiz.score! / quiz.total) * 100)
    : 0;

  // Score-aware dare framing — the title is what shows as the WhatsApp /
  // iMessage / Twitter card heading, so we lead with the hook, not the
  // score.
  const dare =
    accuracy >= 90
      ? `🎉 I aced ${quiz.subtopic ?? quiz.subject} — can you?`
      : accuracy >= 70
      ? `🔥 ${accuracy}% on ${quiz.subtopic ?? quiz.subject}. Can you beat me?`
      : accuracy >= 40
      ? `🥲 ${accuracy}% on ${quiz.subtopic ?? quiz.subject}. Bet you can do better.`
      : `😅 ${quiz.subtopic ?? quiz.subject} destroyed me. Bet you can't even match this.`;

  const title = `${dare} · ExamGrind`;
  const description = `${quiz.score}/${quiz.total} correct. Free, AI-graded practice for CUET, SSC CGL & NEET UG — every wrong answer comes with a concept-level diagnosis.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://examgrind.vercel.app/share/${id}`,
      images: [
        {
          url: `/share/${id}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/share/${id}/opengraph-image`],
    },
  };
}

export default async function SharePage({ params }: Params) {
  const { id } = await params;
  const quiz = await loadQuiz(id);
  if (!quiz) notFound();

  const accuracy = quiz.total > 0
    ? Math.round((quiz.score! / quiz.total) * 100)
    : 0;

  const chickState: "excited" | "happy" | "idle" | "sad" =
    accuracy >= 90 ? "excited"
  : accuracy >= 70 ? "happy"
  : accuracy >= 40 ? "idle"
  :                  "sad";

  const blurb =
    accuracy >= 90 ? "Aced it — can you?"
  : accuracy >= 70 ? "Solid score. Think you can beat me?"
  : accuracy >= 40 ? "Mixed round. Bet you can do better."
  :                  "Tough one. Bet you can't even match this 😏";

  return (
    <main className="bg-warm-wash min-h-[100svh] pb-20">
      {/* Header */}
      <header className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5">
        <Link href="/" className="font-serif text-lg font-bold text-cocoa-900 sm:text-xl">
          ExamGrind
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-2xl bg-ember-600 px-4 py-2 text-xs font-bold text-cream-50 shadow-warm transition hover:bg-ember-700 sm:px-5 sm:py-2.5 sm:text-sm"
        >
          Try free →
        </Link>
      </header>

      {/* Share card */}
      <section className="mx-auto max-w-xl px-4 pt-4 sm:px-6 sm:pt-8">
        <div className="rounded-4xl border border-cocoa-900/[0.06] bg-cream-50 p-6 shadow-warm-lg sm:p-10">
          <div className="flex flex-col items-center text-center">
            <Chick state={chickState} size={140} />

            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-cocoa-500">
              {quiz.subject} · {quiz.subtopic}
            </p>

            <h1 className="mt-2 font-serif text-5xl font-semibold leading-none text-cocoa-900 sm:text-6xl">
              {accuracy}%
            </h1>
            <p className="mt-1 text-sm font-mono text-cocoa-500">
              {quiz.score} / {quiz.total} correct
            </p>

            <p className="mt-5 max-w-md text-base text-cocoa-700">
              {blurb}
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto mt-10 max-w-xl px-4 text-center sm:px-6">
        <h2 className="font-serif text-3xl font-bold leading-tight text-cocoa-900 sm:text-4xl">
          Practice the way it should be.
        </h2>
        <p className="mt-3 text-sm text-cocoa-700 sm:text-base">
          Every wrong answer comes with an AI diagnosis — not just a score. Find the concept you actually need to study.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-2xl bg-ember-600 px-7 py-3.5 text-sm font-bold text-cream-50 shadow-warm-lg transition hover:bg-ember-700 sm:text-base"
        >
          Try ExamGrind — free
        </Link>
        <p className="mt-2 text-xs text-cocoa-500">
          3 quizzes + 1 deep analysis on the house. No card needed.
        </p>
      </section>
    </main>
  );
}
