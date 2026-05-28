import Link from "next/link";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import Chick from "@/components/Chick";
import WaitlistModal from "@/components/WaitlistModal";

/**
 * Public landing page — multi-exam positioning.
 *
 * Leads with the Deep Analysis USP ("know exactly what to study next")
 * because that's the only thing that works horizontally across CUET,
 * SSC CGL, Banking, UPSC, and anything we add later. The chick mascot
 * stays — it's our brand and tests well with the 18-24 demo, which is
 * the same audience across all our launch exams.
 *
 * Each exam card is either:
 *   - Live   → tappable, opens sign-in
 *   - Waitlist → opens WaitlistModal (we collect email + which exam)
 *   - Coming soon → opens WaitlistModal (different copy)
 *
 * Bottom band targets coaching centres (B2B). Single CTA → /institutes.
 */
export default function LandingPage() {
  return (
    <main className="bg-warm-wash min-h-[100svh]">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <span className="font-serif text-xl font-bold text-cocoa-900">
          ExamGrind
        </span>
        <Link
          href="/partners"
          className="hidden text-sm font-semibold text-cocoa-500 hover:text-cocoa-900 sm:inline"
        >
          Partner with us →
        </Link>
      </header>

      {/* Hero */}
      <section className="mx-auto flex max-w-3xl flex-col items-center px-6 pb-12 pt-8 text-center sm:pt-16">
        <Chick state="idle" size={160} className="mb-7" />

        <h1 className="text-balance font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-cocoa-900 sm:text-6xl md:text-7xl">
          Know exactly what to study next.
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-balance text-lg leading-relaxed text-cocoa-700">
          AI-diagnosed practice for India&apos;s biggest competitive exams.
          Every wrong answer comes with a concept-level explanation —
          not just a red X.
        </p>

        <div className="mt-9 flex flex-col items-center gap-3">
          <GoogleLoginButton label="Sign in with Google" redirectTo="/home" />
          <p className="text-sm text-cocoa-500">
            Free to start · ₹75/month after · No credit card
          </p>
        </div>
      </section>

      {/* Exam picker */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cocoa-500">
            Pick your exam
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-cocoa-900 sm:text-4xl">
            One platform. Every exam.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ExamCard
            slug="cuet"
            name="CUET UG"
            blurb="12 subjects · Full NTA syllabus · Live now"
            status="live"
          />
          <ExamCard
            slug="ssc-cgl"
            name="SSC CGL"
            blurb="Quant · Reasoning · English · GA"
            status="waitlist"
            badge="Launching July"
          />
          <ExamCard
            slug="neet-ug"
            name="NEET UG"
            blurb="Physics · Chemistry · Biology · NCERT-aligned"
            status="waitlist"
            badge="Launching July"
          />
          <ExamCard
            slug="suggest"
            name="Suggest an exam"
            blurb="Tell us what to build next"
            status="suggest"
          />
        </div>
      </section>

      {/* USP — Why ExamGrind */}
      <section className="bg-cream-50 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cocoa-500">
              Why ExamGrind
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-cocoa-900 sm:text-4xl">
              Smarter than a mock test. Cheaper than coaching.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <Benefit
              title="AI tells you exactly what's weak"
              body="Every wrong answer comes with a concept-level diagnosis. No more guessing which topic to revise."
            />
            <Benefit
              title="Practice that compounds"
              body="Daily streaks, mastery indicators, and a weakness heatmap across every quiz you've ever taken."
            />
            <Benefit
              title="₹75/month. No trap pricing."
              body="No ₹15K coaching plans. No upsells. No fake discounts. Practice as much as you want."
            />
          </div>
        </div>
      </section>

      {/* Partner program — coaching centres refer & earn */}
      <section className="bg-cocoa-900 py-16 text-cream-50">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sun-400">
              Partner program · For coaching centres
            </p>
            <h2 className="mt-2 font-serif text-2xl font-bold sm:text-3xl">
              Refer your students. Earn ₹37.50 per student, every month.
            </h2>
            <p className="mt-3 text-cream-200">
              Share your referral code. Students get our AI-graded practice
              for ₹75/month. We split it 50/50 with you — for as long as they
              stay subscribed. No contracts, no minimums, no dashboards to
              learn.
            </p>
          </div>
          <Link
            href="/partners"
            className="inline-flex shrink-0 items-center justify-center rounded-2xl bg-sun-500 px-6 py-3 text-sm font-bold text-cocoa-900 shadow-warm transition hover:bg-sun-400"
          >
            Get your referral code →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-5xl px-6 py-10 text-center text-xs text-cocoa-500">
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <Link href="/terms" className="hover:text-cocoa-900">Terms</Link>
          <Link href="/privacy" className="hover:text-cocoa-900">Privacy</Link>
          <Link href="/refund" className="hover:text-cocoa-900">Refunds</Link>
          <Link href="/contact" className="hover:text-cocoa-900">Contact</Link>
          <Link href="/partners" className="hover:text-cocoa-900">Partner program</Link>
        </div>
        <p className="mt-4">© {new Date().getFullYear()} ExamGrind. Made in India.</p>
      </footer>
    </main>
  );
}

type CardStatus = "live" | "waitlist" | "coming_soon" | "suggest";

function ExamCard({
  slug,
  name,
  blurb,
  status,
  badge,
}: {
  slug: string;
  name: string;
  blurb: string;
  status: CardStatus;
  badge?: string;
}) {
  // Live cards link directly to /home (post-signin landing).
  // Everything else opens the WaitlistModal — a client component that
  // posts to /api/waitlist with the slug + email.
  const isLive = status === "live";
  const badgeClass =
    status === "live"
      ? "bg-moss-500/15 text-moss-700"
      : status === "waitlist"
      ? "bg-ember-600/10 text-ember-700"
      : "bg-cocoa-500/10 text-cocoa-500";

  const card = (
    <div className="group flex h-full flex-col rounded-3xl border border-cocoa-900/[0.06] bg-cream-50 p-5 shadow-warm transition hover:-translate-y-0.5 hover:shadow-warm-lg">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-serif text-xl font-bold text-cocoa-900">
          {name}
        </h3>
        {badge && (
          <span className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${badgeClass}`}>
            {badge}
          </span>
        )}
        {isLive && (
          <span className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${badgeClass}`}>
            Live
          </span>
        )}
      </div>
      <p className="mt-2 flex-1 text-sm text-cocoa-700">{blurb}</p>
      <p className="mt-4 text-sm font-semibold text-ember-600 group-hover:text-ember-700">
        {isLive
          ? "Start practicing →"
          : status === "suggest"
          ? "Tell us →"
          : "Join waitlist →"}
      </p>
    </div>
  );

  if (isLive) {
    return (
      <Link href="/home" aria-label={`Practice ${name}`}>
        {card}
      </Link>
    );
  }

  return (
    <WaitlistModal slug={slug} examName={name} status={status}>
      {card}
    </WaitlistModal>
  );
}

function Benefit({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="font-serif text-xl font-bold text-cocoa-900">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-cocoa-700">{body}</p>
    </div>
  );
}
