import Link from "next/link";
import type { Metadata } from "next";
import Chick from "@/components/Chick";
import PartnerApplyForm from "./PartnerApplyForm";

export const metadata: Metadata = {
  title: "Partner program — ExamGrind for coaching centres",
  description:
    "Refer your students. Earn ₹99.50 per student, every month — for as long as they stay subscribed. No contracts, no minimums, no dashboards to learn.",
};

/**
 * Partner program landing page.
 *
 * Designed for coaching-centre owners in Greater Noida (and India broadly)
 * who already have a student book of business. Pitch is:
 *   - Their students get a real product (AI-graded practice for ₹199/mo).
 *   - The centre earns ₹99.50/student/month for life — passive after one
 *     conversation.
 *   - No paperwork, no batch dashboards, no quotas.
 *
 * The form posts to /api/partners/apply which writes a row to
 * partner_applications. We follow up by phone within 48 hours.
 */
export default function PartnersPage() {
  return (
    <main className="bg-warm-wash min-h-[100svh]">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <Link href="/" className="font-serif text-xl font-bold text-cocoa-900">
          ExamGrind
        </Link>
        <Link
          href="/"
          className="text-sm font-semibold text-cocoa-500 hover:text-cocoa-900"
        >
          ← Back to ExamGrind
        </Link>
      </header>

      {/* Hero */}
      <section className="mx-auto flex max-w-3xl flex-col items-center px-6 pb-12 pt-6 text-center sm:pt-12">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-ember-600">
          Partner program · For coaching centres
        </p>
        <h1 className="mt-3 text-balance font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-cocoa-900 sm:text-6xl">
          Refer your students. <br className="hidden sm:block" />
          Earn ₹99.50 per student. <br className="hidden sm:block" />
          Every month.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-balance text-lg leading-relaxed text-cocoa-700">
          Your students get our AI-graded practice for{" "}
          <strong className="text-cocoa-900">₹199/month</strong>. We split it{" "}
          <strong className="text-cocoa-900">50/50</strong> with you — for as
          long as they stay subscribed. No contracts. No minimums. No
          dashboards to learn.
        </p>
        <a
          href="#apply"
          className="mt-9 inline-flex items-center justify-center rounded-2xl bg-cocoa-900 px-7 py-3.5 text-base font-bold text-cream-50 shadow-warm transition hover:bg-cocoa-700"
        >
          Get your referral code ↓
        </a>
      </section>

      {/* Math band — the earnings calculator */}
      <section className="bg-cocoa-900 py-16 text-cream-50">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-sun-400">
            The math
          </p>
          <h2 className="mt-2 text-center font-serif text-3xl font-bold sm:text-4xl">
            What you actually earn
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <MathCard
              students={50}
              perMonth={50 * 37.5}
              perYear={50 * 37.5 * 12}
            />
            <MathCard
              students={100}
              perMonth={100 * 37.5}
              perYear={100 * 37.5 * 12}
              featured
            />
            <MathCard
              students={250}
              perMonth={250 * 37.5}
              perYear={250 * 37.5 * 12}
            />
          </div>

          <p className="mt-8 text-center text-sm text-cream-200">
            Earnings are recurring — paid to your UPI every month, every month
            your students stay subscribed.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-cocoa-500">
          How it works
        </p>
        <h2 className="mt-2 text-center font-serif text-3xl font-bold text-cocoa-900 sm:text-4xl">
          Three steps. No paperwork.
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <Step
            number="1"
            title="Apply in 60 seconds"
            body="Fill the form below. We call you within 48 hours to verify your centre and onboard you over WhatsApp."
          />
          <Step
            number="2"
            title="Share your referral code"
            body="We give you a short code (e.g. NOIDA-RAVI). Your students sign up with it during a free trial — no card required."
          />
          <Step
            number="3"
            title="Get paid every month"
            body="When a student starts paying ₹199/month, ₹99.50 goes straight to your UPI. Forever, as long as they renew."
          />
        </div>
      </section>

      {/* Why ExamGrind for students */}
      <section className="bg-cream-50 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-cocoa-500">
            Why students stick around
          </p>
          <h2 className="mt-2 text-center font-serif text-3xl font-bold text-cocoa-900 sm:text-4xl">
            Your students get something that actually works
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <Benefit
              title="AI tells them what's weak"
              body="Every wrong answer comes with a concept-level diagnosis. They know exactly which topic to revise next — no guessing."
            />
            <Benefit
              title="Practice that compounds"
              body="Daily streaks, mastery indicators, and a weakness heatmap across every quiz. Students see themselves getting better, day by day."
            />
            <Benefit
              title="Built for CUET, SSC CGL, NEET UG"
              body="Full syllabus coverage with exam-specific question style. NCERT-aligned for CUET / NEET. SSC patterns for CGL aspirants."
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-cocoa-500">
          Common questions
        </p>
        <h2 className="mt-2 text-center font-serif text-3xl font-bold text-cocoa-900 sm:text-4xl">
          Quick answers
        </h2>

        <dl className="mt-10 space-y-6">
          <Faq
            q="Is there a minimum number of students I need to refer?"
            a="No. Refer one student, refer two hundred — the math works the same. You earn ₹99.50 for every paying student you bring."
          />
          <Faq
            q="How is the attribution tracked?"
            a="First-touch. The first time a student signs up with your code, they're attributed to you for life — even if they renew years later. They can't switch partners."
          />
          <Faq
            q="When do I get paid?"
            a="Monthly, around the 5th of each month, for the previous month's collections. Paid via UPI directly to the number you give us."
          />
          <Faq
            q="What happens if a student stops paying?"
            a="No payment that month, nothing to share. If they come back next month, payouts resume automatically."
          />
          <Faq
            q="Can I see how my students are doing?"
            a="We don't expose individual student data — that's the student's. But you'll see aggregate metrics on your monthly statement: how many students you brought, how many renewed, how much you earned."
          />
          <Faq
            q="What if I want to stop?"
            a="Email us and we'll deactivate your code that day. Students who already signed up under you keep their access; you keep earning on them as long as they renew."
          />
        </dl>
      </section>

      {/* Apply */}
      <section
        id="apply"
        className="bg-warm-wash px-6 py-20 scroll-mt-6"
      >
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <Chick state="idle" size={100} className="mx-auto mb-5" />
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-ember-600">
              Apply now
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-cocoa-900 sm:text-4xl">
              Become a referral partner
            </h2>
            <p className="mt-3 text-cocoa-700">
              Two minutes to apply. We call within 48 hours.
            </p>
          </div>

          <PartnerApplyForm />
        </div>
      </section>
    </main>
  );
}

function MathCard({
  students,
  perMonth,
  perYear,
  featured,
}: {
  students: number;
  perMonth: number;
  perYear: number;
  featured?: boolean;
}) {
  return (
    <div
      className={`rounded-3xl border p-6 text-center shadow-warm ${
        featured
          ? "border-sun-400/40 bg-cream-50 text-cocoa-900"
          : "border-cream-50/15 bg-cocoa-700/40 text-cream-50"
      }`}
    >
      <p
        className={`text-xs font-semibold uppercase tracking-wider ${
          featured ? "text-ember-600" : "text-sun-400"
        }`}
      >
        {students} students referred
      </p>
      <p
        className={`mt-4 font-serif text-4xl font-bold ${
          featured ? "text-cocoa-900" : "text-cream-50"
        }`}
      >
        ₹{perMonth.toLocaleString("en-IN")}
        <span
          className={`ml-1 text-sm font-normal ${
            featured ? "text-cocoa-500" : "text-cream-200"
          }`}
        >
          /month
        </span>
      </p>
      <p
        className={`mt-2 text-sm ${
          featured ? "text-cocoa-700" : "text-cream-200"
        }`}
      >
        = ₹{perYear.toLocaleString("en-IN")} a year, every year they stay
      </p>
    </div>
  );
}

function Step({
  number,
  title,
  body,
}: {
  number: string;
  title: string;
  body: string;
}) {
  return (
    <div>
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-ember-600 font-serif text-lg font-bold text-cream-50 shadow-warm">
        {number}
      </div>
      <h3 className="mt-4 font-serif text-xl font-bold text-cocoa-900">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-cocoa-700">{body}</p>
    </div>
  );
}

function Benefit({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="font-serif text-xl font-bold text-cocoa-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-cocoa-700">{body}</p>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-2xl border border-cocoa-900/[0.06] bg-cream-50 p-5 shadow-warm">
      <dt className="font-serif text-lg font-bold text-cocoa-900">{q}</dt>
      <dd className="mt-2 text-sm leading-relaxed text-cocoa-700">{a}</dd>
    </div>
  );
}
