import Link from "next/link";

type Props = {
  readiness: number;
  attemptedTopics: number;
  totalTopics: number;
  strongestSubject: string | null;
};

/**
 * A deliberately conservative readiness signal. It measures syllabus
 * coverage and demonstrated topic mastery, not a speculative exam rank.
 */
export default function ReadinessCard({
  readiness,
  attemptedTopics,
  totalTopics,
  strongestSubject,
}: Props) {
  return (
    <section className="mx-auto mt-5 max-w-5xl px-4 sm:px-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-cocoa-900/[0.08] bg-cream-50 p-5 shadow-warm sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-4">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-sun-500/15 font-serif text-2xl font-bold text-cocoa-900">
            {readiness}%
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cocoa-500">Readiness signal</p>
            <h2 className="mt-1 font-serif text-xl font-semibold text-cocoa-900">Built from real practice</h2>
            <p className="mt-1 text-sm leading-6 text-cocoa-700">
              {attemptedTopics} of {totalTopics} topics started
              {strongestSubject ? ` · strongest progress: ${strongestSubject}` : ""}.
            </p>
          </div>
        </div>
        <Link href="/me" className="shrink-0 text-sm font-bold text-ember-700 hover:text-ember-800">
          View progress →
        </Link>
      </div>
      <p className="mt-2 px-1 text-xs text-cocoa-500">
        This is a learning-progress signal, not a predicted exam score.
      </p>
    </section>
  );
}
