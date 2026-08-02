import Link from "next/link";
import WaitlistModal from "@/components/WaitlistModal";
import LandingBook from "@/components/LandingBook";

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
    <main className="min-h-[100svh] overflow-hidden bg-cream-100">
      <header className="absolute inset-x-0 top-0 z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8 sm:py-7">
        <span className="font-serif text-xl font-bold tracking-tight text-cream-50 sm:text-2xl">ExamGrind</span>
        <Link href="/home" className="eg-press rounded-full border border-cream-50/25 px-3.5 py-2 text-xs font-bold text-cream-50 hover:bg-cream-50 hover:text-cocoa-900 sm:px-4">
          Open your study →
        </Link>
      </header>

      {/* Opening chapter — this is intentionally not a dashboard. */}
      <section className="relative isolate min-h-[100svh] overflow-hidden bg-cocoa-900 px-5 pb-12 pt-28 text-cream-50 sm:px-8 sm:pt-32">
        <div className="pointer-events-none absolute -left-24 top-1/4 size-80 rounded-full bg-ember-600/35 blur-[100px]" aria-hidden />
        <div className="pointer-events-none absolute -right-28 bottom-0 size-96 rounded-full bg-violet-600/35 blur-[120px]" aria-hidden />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,252,246,.45)_1px,transparent_1px),linear-gradient(90deg,rgba(255,252,246,.45)_1px,transparent_1px)] [background-size:38px_38px]" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:min-h-[calc(100svh-8rem)] lg:grid-cols-[1.05fr_.95fr] lg:gap-8">
          <div className="max-w-2xl">
            <p className="eg-kicker text-sun-400">A study coach for serious aspirants</p>
            <h1 className="mt-5 font-serif text-5xl font-semibold leading-[.91] tracking-[-0.055em] text-cream-50 sm:text-7xl lg:text-8xl">
              Stop guessing.<br />Start gaining marks.
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-cream-200 sm:text-lg">
              ExamGrind turns each wrong answer into a precise next step—so your preparation becomes a story of marks recovered, not random quizzes completed.
            </p>
            <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <a href="#pick-your-exam" className="eg-press inline-flex items-center gap-2 rounded-2xl bg-sun-400 px-5 py-3.5 text-base font-extrabold text-cocoa-900 shadow-warm-lg">
                Begin your chapter <span aria-hidden>↓</span>
              </a>
              <Link href="/diagnose" className="eg-press rounded-2xl border border-cream-50/25 px-5 py-3.5 text-sm font-bold text-cream-50 hover:bg-cream-50/10">
                Take the 60-sec diagnosis
              </Link>
            </div>
            <p className="mt-4 text-xs font-semibold text-cream-200/65">Free to start · ₹199/month for the full Coach · no credit card</p>
          </div>
          <div className="flex min-h-[21rem] items-center justify-center lg:min-h-[34rem]">
            <LandingBook />
          </div>
        </div>
        <a href="#the-problem" className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-[.2em] text-cream-200/70 transition hover:text-sun-400">Turn the page ↓</a>
      </section>

      <section id="the-problem" className="bg-cream-100 px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[.72fr_1.28fr] lg:items-start">
          <p className="eg-kicker text-ember-700">The problem with preparation</p>
          <div>
            <h2 className="max-w-4xl font-serif text-4xl font-semibold leading-[.98] tracking-[-.045em] text-cocoa-900 sm:text-6xl">Your syllabus is huge. Your time is not. Generic practice makes that worse.</h2>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              <StoryStep number="01" title="Attempt" body="Practice a real exam-style set." />
              <StoryStep number="02" title="Understand" body="See the exact concept behind each lost mark." />
              <StoryStep number="03" title="Recover" body="Return to the right repair and recall at the right time." />
            </div>
          </div>
        </div>
      </section>

      {/* Exam picker */}
      <section id="pick-your-exam" className="scroll-mt-6 bg-cocoa-900 px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-2xl">
            <p className="eg-kicker text-sun-400">Choose your first chapter</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold leading-none tracking-[-.04em] text-cream-50 sm:text-5xl">Your exam gets its own study system.</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ExamCard
            slug="cuet"
            name="CUET UG"
            blurb="12 subjects · Full NTA syllabus · NCERT-aligned"
            status="live"
          />
          <ExamCard
            slug="ssc-cgl"
            name="SSC CGL"
            blurb="Quant · Reasoning · English · GA · Live now"
            status="live"
          />
          <ExamCard
            slug="neet-ug"
            name="NEET UG"
            blurb="Physics · Chemistry · Biology · NCERT-aligned"
            status="live"
          />
          <ExamCard
            slug="suggest"
            name="Suggest an exam"
            blurb="Tell us what to build next"
            status="suggest"
          />
        </div>
        </div>
      </section>

      {/* This is the product's visual promise: diagnosis, repair, proof. */}
      <section className="relative overflow-hidden bg-violet-600 px-5 py-20 text-cream-50 sm:px-8 sm:py-28">
        <div className="pointer-events-none absolute -right-20 top-12 size-96 rounded-full border-[48px] border-sun-400/25" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <p className="eg-kicker text-sun-400">What makes it different</p>
            <h2 className="mt-4 max-w-xl font-serif text-4xl font-semibold leading-[.95] tracking-[-.045em] sm:text-6xl">A quiz is just the beginning of the conversation.</h2>
          </div>
          <div className="grid gap-3">
            <Benefit title="Diagnosis, not a red cross" body="Every wrong answer is traced to the idea, shortcut, or trap that caused it." />
            <Benefit title="A repair path that remembers" body="Your weak concepts and recall schedule return when they are most useful—not when you happen to remember them." />
            <Benefit title="Visible proof that you are moving" body="See practice, accuracy, and readiness build into a preparation you can trust." />
          </div>
        </div>
      </section>

      {/* FAQ — answers the "is this real?" anxiety before they bounce */}
      <section className="mx-auto max-w-3xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cocoa-500">
            Questions students ask
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-cocoa-900 sm:text-4xl">
            Quick answers
          </h2>
        </div>

        <dl className="mt-10 space-y-3">
          <Faq
            q="Is this just another AI quiz app?"
            a="No. Other apps grade your answer and move on. ExamGrind tells you the exact concept you got wrong, points you to the NCERT / R.S. Aggarwal / Lucent section to revise, and tracks your weak spots across every quiz so you can see what to practice next. It's a coach, not a marker."
          />
          <Faq
            q="Will I be charged automatically?"
            a="Yes — ₹199 auto-renews monthly through UPI Autopay (or card mandate, whichever you pick at checkout). You'll get an SMS from your bank before each charge so there are no surprises. Cancel any time from /me → 'Cancel subscription' and you keep access through the cycle you already paid for."
          />
          <Faq
            q="Is the syllabus actually up to date?"
            a="Full NTA CUET UG syllabus (12 subjects), full SSC CGL Tier 1+2 (Quant, Reasoning, English, GA), full NEET UG syllabus (NCERT Class 11+12). 450+ chapters and 2,200+ topics seeded. We update when the official notification changes."
          />
          <Faq
            q="What if I don't like it?"
            a="Cancel any time from /me. Your access continues through the month you already paid for, and no further charges hit your UPI / card. Want a refund instead? Write to support@examgrind.in within 7 days of paying — full refund, no questions. See /refund for the exact policy."
          />
          <Faq
            q="Can I switch between exams?"
            a="Yes. One account works for CUET, SSC CGL, and NEET UG. There's a small dropdown in the top-left of every screen — switch any time, your XP and streak come with you."
          />
          <Faq
            q="Does it work on my phone?"
            a="Yes — the site is mobile-first. You can also install it as an app from your browser: 'Add to Home Screen' on Android Chrome or iOS Safari. Standalone Android + iOS apps coming after launch."
          />
        </dl>
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-5xl px-5 py-10 text-center text-xs text-cocoa-500 sm:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <Link href="/terms" className="hover:text-cocoa-900">Terms</Link>
          <Link href="/privacy" className="hover:text-cocoa-900">Privacy</Link>
          <Link href="/refund" className="hover:text-cocoa-900">Refunds</Link>
          <Link href="/contact" className="hover:text-cocoa-900">Contact</Link>
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
    <div className="eg-press group flex h-full flex-col rounded-[1.6rem] border border-cream-50/15 bg-cream-50 p-5 shadow-warm-lg transition hover:bg-cream-100">
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
    // Route through /start/[slug] so the user's exam choice gets recorded
    // even if they're signed out (sign-in card → OAuth → /home filtered
    // by this exam). Signed-in users get a one-tick exam-switch + /home.
    return (
      <Link href={`/start/${slug}`} aria-label={`Practice ${name}`}>
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
    <div className="rounded-3xl border border-cream-50/20 bg-cream-50/10 p-5 backdrop-blur-sm">
      <h3 className="font-serif text-xl font-bold text-cream-50">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-cream-200">{body}</p>
    </div>
  );
}

function StoryStep({ number, title, body }: { number: string; title: string; body: string }) {
  return (
    <div className="eg-paper rounded-3xl p-5">
      <p className="font-mono text-xs font-bold text-ember-700">{number}</p>
      <h3 className="mt-5 font-serif text-2xl font-bold text-cocoa-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-cocoa-700">{body}</p>
    </div>
  );
}

/**
 * Single FAQ row. Uses native <details>/<summary> so it works without
 * JS (good for SEO crawlers + WhatsApp link previews) and gets the
 * expand/collapse a11y story for free.
 */
function Faq({ q, a }: { q: string; a: string }) {
  return (
    <details className="group rounded-2xl border border-cocoa-900/[0.06] bg-cream-50 p-5 shadow-warm transition open:bg-white">
      <summary className="flex cursor-pointer list-none items-start justify-between gap-3 font-serif text-base font-bold text-cocoa-900 sm:text-lg">
        <span>{q}</span>
        <span
          aria-hidden
          className="mt-1 shrink-0 text-cocoa-500 transition group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <p className="mt-3 text-sm leading-relaxed text-cocoa-700">{a}</p>
    </details>
  );
}
