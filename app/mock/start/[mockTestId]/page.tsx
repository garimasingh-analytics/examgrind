import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { ensureSubscriptionFreshness } from "@/lib/subscription";
import { FREE_LIMITS } from "@/lib/freemium";
import Chick from "@/components/Chick";
import StartMockButton from "./StartMockButton";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ mockTestId: string }> };

type Section = { name: string; questions: number };

/**
 * /mock/start/[mockTestId] — pre-test instructions + start button.
 *
 * Strict-mode rules surfaced explicitly here so the user can't say
 * later "I didn't know quitting burns the attempt".
 */
export default async function MockStartPage({ params }: PageProps) {
  const { mockTestId } = await params;

  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: mock } = await supabase
    .from("mock_tests")
    .select(
      "id, display_name, description, total_questions, duration_seconds, positive_marks, negative_marks, sections, is_active, exam:exams(name, slug)"
    )
    .eq("id", mockTestId)
    .maybeSingle();

  if (!mock || !(mock as { is_active: boolean }).is_active) {
    return (
      <main className="mx-auto max-w-2xl px-5 py-16 text-center">
        <Chick state="sad" size={120} className="mx-auto" />
        <h1 className="mt-4 font-serif text-3xl font-bold text-cocoa-900">
          That mock isn&apos;t available
        </h1>
        <p className="mt-2 text-sm text-cocoa-700">
          It may have been replaced. Pick another from the catalog.
        </p>
        <Link
          href="/mock"
          className="mt-6 inline-flex rounded-2xl bg-cocoa-900 px-5 py-2.5 text-sm font-bold text-cream-50"
        >
          Back to mocks
        </Link>
      </main>
    );
  }

  const m = mock as unknown as {
    id: string;
    display_name: string;
    description: string | null;
    total_questions: number;
    duration_seconds: number;
    positive_marks: number;
    negative_marks: number;
    sections: Section[];
    exam: { name: string; slug: string } | null;
  };

  // Freemium read for the warning banner. (Server gate also runs in
  // /api/mock/start; this is just display.)
  const { data: profile } = await supabase
    .from("users")
    .select("subscription_status, paid_until, mock_tests_started")
    .eq("id", user.id)
    .maybeSingle<{
      subscription_status: "free" | "trial" | "paid";
      paid_until: string | null;
      mock_tests_started: number;
    }>();

  const liveSubStatus = await ensureSubscriptionFreshness(
    user.id,
    profile?.subscription_status ?? "free",
    profile?.paid_until ?? null
  );
  const isPaid = liveSubStatus === "paid";
  const freeUsed = profile?.mock_tests_started ?? 0;
  const freeLeft = isPaid ? Infinity : Math.max(0, FREE_LIMITS.mock - freeUsed);

  const minutes = Math.round(m.duration_seconds / 60);

  return (
    <main className="min-h-screen bg-cream-50">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5 sm:px-8">
        <Link
          href="/mock"
          className="text-sm font-semibold text-cocoa-700 transition hover:text-cocoa-900"
        >
          ← Back to mocks
        </Link>
      </header>

      <section className="mx-auto max-w-3xl px-5 pb-16 sm:px-8">
        <div className="flex items-start gap-3">
          <Chick state="idle" size={64} />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cocoa-500">
              {m.exam?.name ?? "Mock"}
            </p>
            <h1 className="font-serif text-3xl font-bold text-cocoa-900 sm:text-4xl">
              {m.display_name}
            </h1>
            {m.description && (
              <p className="mt-2 text-sm text-cocoa-700">{m.description}</p>
            )}
          </div>
        </div>

        {/* Stat row */}
        <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-4">
          <Stat label="Questions" value={m.total_questions} />
          <Stat label="Time" value={`${minutes} min`} />
          <Stat
            label="Marking"
            value={`+${Number(m.positive_marks)} / −${Number(m.negative_marks)}`}
          />
        </div>

        {m.sections.length > 1 && (
          <div className="mt-6 rounded-2xl border border-cocoa-900/[0.06] bg-cream-50 p-4 shadow-warm sm:p-5">
            <h2 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cocoa-500">
              Sections
            </h2>
            <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
              {m.sections.map((s) => (
                <li key={s.name} className="flex justify-between text-sm">
                  <span className="text-cocoa-900">{s.name}</span>
                  <span className="text-cocoa-500">{s.questions} Q</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Strict-mode rules */}
        <div className="mt-6 rounded-2xl border border-ember-500/30 bg-ember-500/10 p-4 sm:p-5">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ember-700">
            Real exam rules
          </h2>
          <ul className="mt-2 space-y-1.5 text-sm text-cocoa-900">
            <li>• The timer can&apos;t be paused.</li>
            <li>• Auto-submits at 0:00.</li>
            <li>
              • Quitting <strong>burns the attempt</strong>. You can&apos;t
              resume — you&apos;d have to start a new mock from scratch.
            </li>
            <li>• Closing the tab counts as quitting.</li>
            <li>
              • Wrong answers <strong>cost you marks</strong> — skip if
              you&apos;re not sure.
            </li>
          </ul>
        </div>

        {/* Freemium warning */}
        {!isPaid && (
          <p className="mt-4 rounded-2xl bg-cocoa-100 px-4 py-3 text-center text-xs font-semibold text-cocoa-700">
            {freeLeft > 0
              ? `You have ${freeLeft} free mock left. Starting this one uses it — quitting still counts.`
              : "You've used your free mock. Click Start to upgrade and continue."}
          </p>
        )}

        <StartMockButton mockTestId={m.id} />
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-cocoa-900/[0.06] bg-cream-50 p-3 text-center shadow-warm sm:p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cocoa-500">
        {label}
      </p>
      <p className="mt-1 font-serif text-2xl font-bold text-cocoa-900">
        {value}
      </p>
    </div>
  );
}
