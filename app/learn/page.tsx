import Link from "next/link";
import { redirect } from "next/navigation";
import StudentPageHeader from "@/components/StudentPageHeader";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function LearnPage() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: profile } = await supabase
    .from("users")
    .select("exam_choice")
    .eq("id", user.id)
    .maybeSingle<{ exam_choice: string | null }>();
  const examSlug = profile?.exam_choice ?? "cuet";

  return (
    <main className="min-h-[100svh] bg-warm-wash pb-28">
      <StudentPageHeader examSlug={examSlug} section="Learn" />

      <section className="mx-auto max-w-5xl px-4 pt-3 sm:px-6 sm:pt-7">
        <div className="border-y border-cocoa-900/[.13] bg-cream-50 px-5 py-7 shadow-warm sm:px-8 sm:py-10">
          <p className="eg-kicker text-ember-700">Learn one thing clearly</p>
          <h1 className="mt-2 max-w-2xl font-serif text-4xl font-bold leading-[.92] tracking-[-.055em] text-cocoa-900 sm:text-6xl">Understand it before you practise it.</h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-cocoa-700">Start with the exact concept that is blocking you. Coach teaches it, guides keep your exam context close, and memory tools help it stay with you.</p>
          <Link href="/coach#learn-with-coach" className="mt-6 inline-flex rounded-xl bg-cocoa-900 px-5 py-3 text-sm font-extrabold text-cream-50 transition hover:bg-cocoa-800">Learn a topic →</Link>
        </div>
      </section>

      <section className="mx-auto mt-6 max-w-5xl px-4 sm:px-6" aria-label="Learning tools">
        <div className="divide-y divide-cocoa-900/[.09] border-y border-cocoa-900/[.12] bg-cream-50 shadow-warm">
          <LearnRow href="/coach#learn-with-coach" number="01" label="Coach lessons" detail="Ask about any exact topic, follow a focused explanation, then move straight into practice." action="Open Coach" />
          <LearnRow href={`/guides?exam=${examSlug}`} number="02" label="Study guides" detail="Use the syllabus, exam pattern and official context to decide what deserves your time." action="Open guides" />
          <LearnRow href="/vault" number="03" label="Flashcards & mnemonics" detail="Create and revisit small memory tools whenever a concept needs to stay with you." action="Open Vault" />
        </div>
      </section>

      <section className="mx-auto mt-6 max-w-5xl px-4 sm:px-6">
        <div className="border-l-2 border-ember-600 bg-sun-300/15 px-5 py-5 sm:px-6">
          <p className="eg-kicker text-ember-700">Your learning memory</p>
          <h2 className="mt-1 font-serif text-2xl font-bold tracking-[-.045em] text-cocoa-900">Your next lesson should start where the last one stopped.</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-cocoa-700">Coach keeps your recent topics close so you can reopen a lesson instead of searching for it again.</p>
          <Link href="/coach#learn-with-coach" className="mt-4 inline-flex border-b border-ember-700/35 pb-0.5 text-sm font-bold text-ember-700">Continue learning →</Link>
        </div>
      </section>
    </main>
  );
}

function LearnRow({ href, number, label, detail, action }: { href: string; number: string; label: string; detail: string; action: string }) {
  return <Link href={href} className="group grid gap-3 px-5 py-5 transition hover:bg-sun-300/10 sm:grid-cols-[3rem_1fr_auto] sm:items-center sm:px-6"><span className="font-mono text-xs font-bold tracking-[.14em] text-ember-700">{number}</span><span><span className="font-serif text-2xl font-bold tracking-[-.04em] text-cocoa-900">{label}</span><span className="mt-1 block max-w-2xl text-sm leading-6 text-cocoa-700">{detail}</span></span><span className="text-sm font-bold text-ember-700">{action} →</span></Link>;
}
