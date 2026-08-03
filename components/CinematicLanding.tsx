"use client";

import Link from "next/link";
import { useState } from "react";
import Chick from "@/components/Chick";
import {
  trackLandingBookOpened,
  trackLandingCtaClicked,
  trackLandingExamSelected,
} from "@/lib/product-analytics";

const exams = [
  { slug: "cuet", name: "CUET UG", line: "12 subjects · NCERT-aligned", mark: "C" },
  { slug: "ssc-cgl", name: "SSC CGL", line: "Quant · Reasoning · English · GA", mark: "S" },
  { slug: "neet-ug", name: "NEET UG", line: "Physics · Chemistry · Biology", mark: "N" },
] as const;

type Exam = (typeof exams)[number]["slug"];
const pageCount = 5;

export default function CinematicLanding() {
  const [opened, setOpened] = useState(false);
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [exam, setExam] = useState<Exam>("ssc-cgl");
  const chosen = exams.find((item) => item.slug === exam) ?? exams[1];

  const openBook = () => {
    if (!opened) trackLandingBookOpened();
    setOpened(true);
  };
  const turn = (next: number) => {
    setDirection(next > page ? "forward" : "back");
    setPage(next);
  };

  return (
    <main className={`storybook-landing ${opened ? "book-is-open" : ""}`}>
      <header className="storybook-nav">
        <Link href="/" className="storybook-logo"><span aria-hidden /> EXAMGRIND</Link>
        <Link href="/home" className="storybook-resume" onClick={() => trackLandingCtaClicked({ placement: "hero" })}>
          I already study here <span aria-hidden>→</span>
        </Link>
      </header>

      {!opened ? (
        <section className="storybook-cover-stage" aria-labelledby="storybook-title">
          <div className="storybook-cover-copy">
            <p>FOR THE STUDENT WHO WANTS A REAL PLAN</p>
            <h1 id="storybook-title">Your score<br />has a story.<br /><em>Let&apos;s change it.</em></h1>
            <span className="storybook-arrow" aria-hidden>↘</span>
          </div>
          <button type="button" className="storybook-cover" onClick={openBook} aria-label="Open your ExamGrind study story">
            <span className="storybook-cover-shine" aria-hidden />
            <span className="storybook-cover-kicker">EXAMGRIND · ISSUE 01</span>
            <strong>YOUR<br />NEXT<br />CHAPTER</strong>
            <span className="storybook-cover-mark" aria-hidden>✦</span>
            <span className="storybook-cover-foot">TAP TO OPEN</span>
          </button>
          <button type="button" onClick={openBook} className="storybook-open-cta">Open your study story <span aria-hidden>↓</span></button>
        </section>
      ) : (
        <section className="storybook-reader" aria-label="ExamGrind study story">
          <div className="storybook-reader-glow" aria-hidden />
          <div className="storybook-book-shell">
            <div className="storybook-book-topbar">
              <span>EXAMGRIND · YOUR STUDY STORY</span>
              <span>{String(page + 1).padStart(2, "0")} / {String(pageCount).padStart(2, "0")}</span>
            </div>
            <div className={`storybook-spread page-${page} turn-${direction}`} key={`${page}-${exam}`}>
              <div className="storybook-left-page">
                <p className="storybook-page-label">{String(page + 1).padStart(2, "0")} · {page === 0 ? "START HERE" : page === 1 ? "THE DIFFERENCE" : page === 2 ? "YOUR EXAM" : page === 3 ? "YOUR ACCESS" : "THE FIRST MOVE"}</p>
                <PageLeft page={page} />
              </div>
              <div className="storybook-right-page">
                <PageRight page={page} exam={exam} setExam={setExam} chosen={chosen} />
              </div>
            </div>
            <div className="storybook-reader-controls">
              <button type="button" onClick={() => turn(page - 1)} disabled={page === 0}>← Back</button>
              <div className="storybook-progress" aria-label={`Page ${page + 1} of ${pageCount}`}>
                {Array.from({ length: pageCount }, (_, index) => <span key={index} className={index === page ? "active" : index < page ? "read" : ""} />)}
              </div>
              {page < pageCount - 1 ? (
                <button type="button" onClick={() => turn(page + 1)}>Turn page <span aria-hidden>→</span></button>
              ) : (
                <Link href={`/start/${exam}`} onClick={() => trackLandingExamSelected({ exam })}>Begin <span aria-hidden>→</span></Link>
              )}
            </div>
          </div>
        </section>
      )}

      <footer className="storybook-footer">
        <span>© {new Date().getFullYear()} ExamGrind</span>
        <nav><Link href="/terms">Terms</Link><Link href="/privacy">Privacy</Link><Link href="/contact">Contact</Link></nav>
      </footer>
    </main>
  );
}

function PageLeft({ page }: { page: number }) {
  if (page === 0) return <><h2>There is no such thing as<br /><em>&ldquo;bad at everything.&rdquo;</em></h2><p className="storybook-body-copy">There are only concepts waiting to be found. Start with one honest attempt; we&apos;ll make the next step specific.</p><span className="storybook-margin-note">not a timetable<br />you&apos;ll ignore <b>↘</b></span></>;
  if (page === 1) return <><h2>Practice should leave<br /><em>proof.</em></h2><p className="storybook-body-copy">Not a red cross. Not a vague score. Evidence of exactly where marks were lost—and where they can come back.</p><div className="storybook-path"><span>ATTEMPT</span><i /><span>DIAGNOSE</span><i /><span>RECOVER</span></div></>;
  if (page === 2) return <><h2>Your exam is not<br /><em>every exam.</em></h2><p className="storybook-body-copy">Your chapters, questions, countdown and repair queue should match the paper you are actually preparing for.</p><span className="storybook-margin-note">pick one<br />battlefield <b>↓</b></span></>;
  if (page === 3) return <><h2>Start free.<br />Upgrade when your<br /><em>study proves it.</em></h2><p className="storybook-body-copy">No card. Three free quizzes to see the system. The Coach unlocks when you want unlimited practice and analysis.</p></>;
  return <><h2>One honest test.<br /><em>A clearer next day.</em></h2><p className="storybook-body-copy">Choose your exam, take the diagnostic, and get the first proof point in your own study story.</p><span className="storybook-margin-note">this is where<br />your chapter starts <b>→</b></span></>;
}

function PageRight({ page, exam, setExam, chosen }: { page: number; exam: Exam; setExam: (exam: Exam) => void; chosen: (typeof exams)[number] }) {
  if (page === 0) return <div className="storybook-chick-page"><span className="storybook-sticker">TODAY</span><div className="storybook-chick-orbit"><Chick state="excited" size={110} /></div><strong>1 honest<br />diagnostic</strong><span>knows more than<br />10 random quizzes.</span></div>;
  if (page === 1) return <div className="storybook-evidence-page"><div><span>WRONG ANSWER</span><b>Reversible reactions &amp; Kc/Kp</b><small>Not “weak at Chemistry.” A specific repair.</small></div><div><span>NEXT STEP</span><b>8 questions + short recall</b><small>Added to your queue at the right time.</small></div><span className="storybook-evidence-doodle" aria-hidden>✦</span></div>;
  if (page === 2) return <div className="storybook-exam-page"><div className="storybook-exam-tabs">{exams.map((item) => <button type="button" key={item.slug} className={exam === item.slug ? "active" : ""} onClick={() => setExam(item.slug)}><span>{item.mark}</span>{item.name}</button>)}</div><div className="storybook-exam-card"><p>YOUR {chosen.name} CHAPTER</p><b>Find the 3 topics<br />costing you marks.</b><span>{chosen.line}</span><i aria-hidden>✦</i></div></div>;
  if (page === 3) return <div className="storybook-access-page"><div><span>FREE START</span><b>3 quizzes</b><small>See your baseline. No card.</small></div><div className="featured"><span>COACH · ₹199/MONTH</span><b>Unlimited practice + deep analysis</b><small>Your repair, revision and study direction stay connected.</small></div><p>Cancel any time. Upgrade only when you are ready.</p></div>;
  return <div className="storybook-final-page"><div className="storybook-final-orbit"><Chick state="happy" size={118} /></div><span>YOUR NEXT CHAPTER</span><b>{chosen.name}</b><p>Start with the diagnostic. It is free.</p></div>;
}
