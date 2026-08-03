"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Chick from "@/components/Chick";
import {
  trackLandingBookOpened,
  trackLandingCtaClicked,
  trackLandingExamSelected,
} from "@/lib/product-analytics";

const exams = [
  { slug: "cuet", name: "CUET UG", subjects: "12 subjects · NCERT-aligned", mark: "C" },
  { slug: "ssc-cgl", name: "SSC CGL", subjects: "Quant · Reasoning · English · GA", mark: "S" },
  { slug: "neet-ug", name: "NEET UG", subjects: "Physics · Chemistry · Biology", mark: "N" },
] as const;

function Scribble({ children, className = "" }: { children: string; className?: string }) {
  return <span aria-hidden className={`landing-scribble ${className}`}>{children}</span>;
}

export default function CinematicLanding() {
  const [bookOpen, setBookOpen] = useState(false);
  const [activeExam, setActiveExam] = useState<(typeof exams)[number]["slug"]>("ssc-cgl");

  useEffect(() => {
    const timer = window.setTimeout(() => setBookOpen(true), 520);
    return () => window.clearTimeout(timer);
  }, []);

  const revealBook = () => {
    if (!bookOpen) trackLandingBookOpened();
    setBookOpen((open) => !open);
  };

  const selected = exams.find((exam) => exam.slug === activeExam) ?? exams[1];

  return (
    <main className="cinematic-landing">
      <header className="landing-nav">
        <Link href="/" className="landing-logo" aria-label="ExamGrind home">
          <span className="landing-logo-dot" aria-hidden />
          EXAMGRIND
        </Link>
        <Link href="/home" className="landing-quiet-link">I already study here <span aria-hidden>↗</span></Link>
      </header>

      <section className="landing-hero" aria-labelledby="landing-title">
        <div className="landing-grain" aria-hidden />
        <div className="landing-sun landing-sun-one" aria-hidden />
        <div className="landing-sun landing-sun-two" aria-hidden />
        <Scribble className="landing-scribble-one">✦</Scribble>
        <Scribble className="landing-scribble-two">↗</Scribble>

        <div className="landing-hero-copy">
          <p className="landing-eyebrow"><span>●</span> FOR THE STUDENT WHO WANTS A REAL PLAN</p>
          <h1 id="landing-title">
            Your score has<br />a story.<br /><em>Let&apos;s change it.</em>
          </h1>
          <p className="landing-lede">
            One honest diagnostic turns the next thing you study into the right thing to study.
          </p>
          <a
            href="#choose"
            onClick={() => trackLandingCtaClicked({ placement: "hero" })}
            className="landing-primary-cta"
          >
            Start my free diagnostic <span aria-hidden>↓</span>
          </a>
          <p className="landing-proof">3 free quizzes · no card · built for CUET, SSC CGL &amp; NEET UG</p>
        </div>

        <button
          type="button"
          className={`story-book ${bookOpen ? "is-open" : ""}`}
          onClick={revealBook}
          aria-label={bookOpen ? "Close the ExamGrind story book" : "Open the ExamGrind story book"}
        >
          <span className="story-book-shadow" aria-hidden />
          <span className="story-book-pages" aria-hidden />
          <span className="story-book-cover" aria-hidden>
            <span className="story-book-cover-kicker">EXAMGRIND</span>
            <span className="story-book-cover-title">YOUR<br />NEXT<br />CHAPTER</span>
            <span className="story-book-cover-index">ISSUE 01</span>
            <span className="story-book-cover-doodle">✶</span>
          </span>
          <span className="story-book-spread" aria-hidden>
            <span className="story-book-page-left">
              <span className="story-book-page-kicker">THE TURNING POINT</span>
              <strong>There is no<br />such thing as<br />&ldquo;bad at<br />everything.&rdquo;</strong>
              <span className="story-book-note">There are only concepts waiting to be found.</span>
            </span>
            <span className="story-book-page-right">
              <span className="story-book-sticker">TODAY</span>
              <span className="story-book-chick"><Chick state="excited" size={78} /></span>
              <span className="story-book-signal">72<span>%</span></span>
              <span className="story-book-signal-label">marks ready to recover</span>
            </span>
          </span>
          <span className="story-book-hint">Tap to turn the page</span>
        </button>
      </section>

      <section className="landing-manifesto" aria-labelledby="manifesto-title">
        <p className="landing-section-number">01 / THE PROBLEM</p>
        <div>
          <p className="landing-handwritten">The old way:</p>
          <h2 id="manifesto-title">More quizzes.<br />More panic.<br /><span>Same blind spots.</span></h2>
        </div>
        <p className="landing-manifesto-copy">Most practice apps count your attempts. ExamGrind follows the marks you lost, finds the reason, then gives you a path back.</p>
      </section>

      <section className="landing-proof-section" aria-labelledby="proof-title">
        <div className="landing-section-heading">
          <p className="landing-section-number">02 / THE DIFFERENCE</p>
          <h2 id="proof-title">A real study coach<br />leaves <em>evidence.</em></h2>
        </div>
        <div className="landing-proof-grid">
          <article className="landing-proof-card proof-attempt">
            <span className="landing-card-index">01</span>
            <span className="landing-card-icon">?</span>
            <h3>Attempt</h3>
            <p>Practice an exam-style set in the subject you actually chose.</p>
          </article>
          <article className="landing-proof-card proof-diagnose">
            <span className="landing-card-index">02</span>
            <span className="landing-card-icon">✦</span>
            <h3>Diagnose</h3>
            <p>See the concept, trap, and repair step behind every lost mark.</p>
          </article>
          <article className="landing-proof-card proof-recover">
            <span className="landing-card-index">03</span>
            <span className="landing-card-icon">↗</span>
            <h3>Recover</h3>
            <p>Return to it through your repair and revision queues—at the right time.</p>
          </article>
        </div>
        <div className="landing-margin-note"><span>not another quiz app</span><i aria-hidden>↘</i></div>
      </section>

      <section id="choose" className="landing-exam-section" aria-labelledby="exam-title">
        <div className="landing-exam-intro">
          <p className="landing-section-number">03 / YOUR STARTING LINE</p>
          <h2 id="exam-title">Choose your<br /><em>battlefield.</em></h2>
          <p>No generic dashboard. Your chapters, countdown, questions, and next steps begin with one exam.</p>
        </div>
        <div className="landing-exam-stage">
          <div className="landing-exam-tabs" role="tablist" aria-label="Choose your exam">
            {exams.map((exam) => (
              <button
                type="button"
                key={exam.slug}
                role="tab"
                aria-selected={activeExam === exam.slug}
                className={activeExam === exam.slug ? "is-active" : ""}
                onClick={() => setActiveExam(exam.slug)}
              >
                <span>{exam.mark}</span>{exam.name}
              </button>
            ))}
          </div>
          <div className="landing-exam-preview">
            <div className="landing-preview-paper">
              <p>YOUR {selected.name} CHAPTER</p>
              <h3>Find the 3 topics<br />costing you marks.</h3>
              <div className="landing-preview-topics">
                <span>01 · REPAIR</span><span>02 · BUILD</span><span>03 · RECALL</span>
              </div>
              <p className="landing-preview-subjects">{selected.subjects}</p>
              <Link
                href={`/start/${selected.slug}`}
                onClick={() => trackLandingExamSelected({ exam: selected.slug })}
                className="landing-preview-cta"
              >
                Start with {selected.name} <span aria-hidden>→</span>
              </Link>
            </div>
            <div className="landing-preview-orbit" aria-hidden><Chick state="happy" size={92} /></div>
            <Scribble className="landing-preview-star">✦</Scribble>
          </div>
        </div>
      </section>

      <section className="landing-closing" aria-labelledby="closing-title">
        <div className="landing-closing-paper">
          <p className="landing-section-number">READY WHEN YOU ARE</p>
          <h2 id="closing-title">The next mark<br />can be <em>yours.</em></h2>
          <p>Begin with three free quizzes. Upgrade only when your own study story proves it is worth it.</p>
          <a href="#choose" onClick={() => trackLandingCtaClicked({ placement: "closing" })} className="landing-primary-cta">Choose my exam <span aria-hidden>↑</span></a>
        </div>
      </section>

      <footer className="landing-footer">
        <p>© {new Date().getFullYear()} ExamGrind · Made for serious Indian aspirants.</p>
        <nav aria-label="Legal"><Link href="/terms">Terms</Link><Link href="/privacy">Privacy</Link><Link href="/refund">Refunds</Link><Link href="/contact">Contact</Link></nav>
      </footer>
    </main>
  );
}
