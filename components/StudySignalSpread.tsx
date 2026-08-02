import Link from "next/link";
import Chick from "@/components/Chick";

type Props = {
  firstName: string;
  eyebrow: string;
  title: string;
  detail: string;
  action: string;
  actionHref: string;
  examName: string;
  countdown: string | null;
  todayProof: string;
  readinessProof: string;
  children: React.ReactNode;
};

/** The signed-in counterpart to the landing book: a calm, data-backed daily spread. */
export default function StudySignalSpread({
  firstName, eyebrow, title, detail, action, actionHref, examName, countdown,
  todayProof, readinessProof, children,
}: Props) {
  return (
    <section className="eg-page-enter mx-auto max-w-5xl px-4 pt-6 sm:px-6 sm:pt-10">
      <div className="home-spread-scene">
        <div className="home-spread">
          <article className="home-spread-left">
            <p className="eg-kicker text-ember-700">{eyebrow} · Hi, {firstName}</p>
            <div className="mt-auto max-w-xl pt-12 sm:pt-20">
              <p className="font-mono text-[11px] font-bold text-cocoa-500">TODAY / ONE THING AT A TIME</p>
              <h1 className="mt-3 font-serif text-4xl font-semibold leading-[.94] tracking-[-.05em] text-cocoa-900 sm:text-5xl">{title}</h1>
              <p className="mt-4 max-w-lg text-sm leading-6 text-cocoa-700 sm:text-base">{detail}</p>
              <Link href={actionHref} className="eg-press mt-6 inline-flex items-center gap-2 rounded-2xl bg-cocoa-900 px-4 py-3 text-sm font-extrabold text-cream-50 shadow-warm">
                {action} <span aria-hidden>→</span>
              </Link>
            </div>
          </article>
          <article className="home-spread-right">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eg-kicker text-violet-600">Your exam</p>
                <p className="mt-1 font-serif text-xl font-semibold text-cocoa-900">{examName}</p>
              </div>
              <Chick state="idle" size={62} />
            </div>
            <div className="mt-9 rounded-3xl bg-cocoa-900 p-5 text-cream-50 shadow-warm">
              <p className="eg-kicker text-sun-400">Countdown</p>
              <p className="mt-2 font-mono text-3xl font-bold tracking-[-.06em] text-cream-50">{countdown ?? "SET YOUR DATE"}</p>
              <p className="mt-1 text-xs font-semibold text-cream-200/75">{countdown ? "until your target exam" : "make the plan personal below"}</p>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div><p className="eg-kicker text-cocoa-500">Today</p><p className="mt-1 text-sm font-bold leading-5 text-cocoa-900">{todayProof}</p></div>
              <div><p className="eg-kicker text-cocoa-500">Readiness</p><p className="mt-1 text-sm font-bold leading-5 text-cocoa-900">{readinessProof}</p></div>
            </div>
            <div className="mt-5 border-t border-cocoa-900/[.08] pt-4">{children}</div>
          </article>
        </div>
      </div>
    </section>
  );
}
