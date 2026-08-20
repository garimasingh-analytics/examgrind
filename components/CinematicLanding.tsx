"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Chick from "@/components/Chick";
import { trackLandingBookOpened, trackLandingCtaClicked, trackLandingExamSelected } from "@/lib/product-analytics";

const exams = [
  { slug: "cuet", label: "CUET UG", detail: "12 subjects · NCERT-aligned", colour: "amber" },
  { slug: "ssc-cgl", label: "SSC CGL", detail: "Quant · Reasoning · English · GA", colour: "violet" },
  { slug: "neet-ug", label: "NEET UG", detail: "Physics · Chemistry · Biology", colour: "coral" },
] as const;

export default function CinematicLanding() {
  const [exam, setExam] = useState<(typeof exams)[number]["slug"]>("ssc-cgl");
  const choice = exams.find((item) => item.slug === exam) ?? exams[1];

  useEffect(() => {
    trackLandingBookOpened();
  }, []);

  return <main className="editorial-gallery">
    <header className="egallery-nav">
      <Link href="/" className="egallery-logo"><i />EXAMGRIND</Link>
      <Link href="/sign-in" className="egallery-resume">
        I already study here
      </Link>
    </header>

    <section className="egallery-hero" aria-labelledby="egallery-title">
      <div className="egallery-hero-copy">
        <p className="egallery-eyebrow">YOUR SCORE IS ONLY THE BEGINNING</p>
        <h1 id="egallery-title">Find the topics<br />costing you <em>marks.</em></h1>
        <p>Take a 90-second diagnostic. ExamGrind shows the concepts you missed and the clearest place to start fixing them.</p>
        <a href="#your-exam" className="egallery-primary" onClick={() => trackLandingCtaClicked({ placement: "hero" })}>Find my weak topics</a>
        <small>5 questions · 90 seconds · no signup required</small>
      </div>
      <div className="egallery-hero-art" aria-hidden>
        <span className="egallery-sun" /><span className="egallery-paper egallery-paper-one">ONE<br />HONEST<br />ATTEMPT</span><span className="egallery-paper egallery-paper-two">YOUR<br />NEXT<br />STEP</span><span className="egallery-chick"><Chick state="happy" size={118} /></span>
      </div>
    </section>

    <section className="egallery-signal" aria-labelledby="signal-title">
      <p className="egallery-eyebrow">WHAT YOU GET AFTER A TEST</p>
      <h2 id="signal-title">A mock test should<br />not end with a <em>score.</em></h2>
      <div className="egallery-signal-grid">
        <article><b>01 · SCORE LEAKS</b><h3>What went wrong?</h3><p>See the exact concept behind every lost mark—not just the answer you missed.</p></article>
        <article><b>02 · YOUR NEXT MOVE</b><h3>What should I study?</h3><p>Start with the weakness that deserves your next study session, not a random playlist.</p></article>
        <article><b>03 · PROOF</b><h3>Did I improve?</h3><p>Targeted practice and a retest make progress visible instead of leaving you guessing.</p></article>
      </div>
    </section>

    <section id="your-exam" className="egallery-exam" aria-labelledby="exam-title">
      <div><p className="egallery-eyebrow">YOUR STARTING LINE</p><h2 id="exam-title">Choose your<br /><em>exam.</em></h2><p className="egallery-intro">Start with five exam-level questions. We will show the concepts to revisit before your next attempt.</p></div>
      <div className="egallery-picker">
        <div className="egallery-tabs" role="tablist" aria-label="Choose your exam">{exams.map((item) => <button type="button" role="tab" aria-selected={item.slug === exam} key={item.slug} onClick={() => setExam(item.slug)} className={item.slug === exam ? "active" : ""}>{item.label}</button>)}</div>
        <div className={`egallery-choice ${choice.colour}`}><p>YOUR {choice.label} DIAGNOSIS</p><h3>Find the topics<br />costing you marks.</h3><span>{choice.detail}</span><Link href={`/diagnose/${choice.slug}`} onClick={() => trackLandingExamSelected({ exam: choice.slug })}>Start my diagnosis</Link></div>
      </div>
    </section>

    <section className="egallery-close" aria-labelledby="close-title"><div><p className="egallery-eyebrow">THE FIRST MOVE IS FREE</p><h2 id="close-title">Stop guessing what<br />to study <em>next.</em></h2><p>Start with one diagnosis. See the concepts behind your score before you create an account or pay for anything.</p><Link href={`/diagnose/${choice.slug}`} onClick={() => trackLandingExamSelected({ exam: choice.slug })} className="egallery-primary">Take my free diagnosis</Link></div><Chick state="excited" size={154} /></section>
    <footer className="egallery-footer"><span>© {new Date().getFullYear()} ExamGrind</span><nav><Link href="/terms">Terms</Link><Link href="/privacy">Privacy</Link><Link href="/contact">Contact</Link></nav></footer>
  </main>;
}
