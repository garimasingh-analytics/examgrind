"use client";

import Link from "next/link";
import { useState } from "react";
import Chick from "@/components/Chick";
import { trackLandingCtaClicked, trackLandingExamSelected } from "@/lib/product-analytics";

const exams = [
  { slug: "cuet", label: "CUET UG", detail: "12 subjects · NCERT-aligned", colour: "amber" },
  { slug: "ssc-cgl", label: "SSC CGL", detail: "Quant · Reasoning · English · GA", colour: "violet" },
  { slug: "neet-ug", label: "NEET UG", detail: "Physics · Chemistry · Biology", colour: "coral" },
] as const;

export default function CinematicLanding() {
  const [exam, setExam] = useState<(typeof exams)[number]["slug"]>("ssc-cgl");
  const choice = exams.find((item) => item.slug === exam) ?? exams[1];

  return <main className="editorial-gallery">
    <header className="egallery-nav">
      <Link href="/" className="egallery-logo"><i />EXAMGRIND</Link>
      <button
        type="button"
        className="egallery-resume"
        onClick={() => window.location.assign("/home")}
      >
        I already study here
      </button>
    </header>

    <section className="egallery-hero" aria-labelledby="egallery-title">
      <div className="egallery-hero-copy">
        <p className="egallery-eyebrow">A STUDY SYSTEM FOR SERIOUS ASPIRANTS</p>
        <h1 id="egallery-title">Make every<br /><em>next hour</em><br />count.</h1>
        <p>ExamGrind turns an honest attempt into a specific plan for the marks you can still recover.</p>
        <a href="#your-exam" className="egallery-primary" onClick={() => trackLandingCtaClicked({ placement: "hero" })}>Start free</a>
        <small>3 free quizzes · no card required</small>
      </div>
      <div className="egallery-hero-art" aria-hidden>
        <span className="egallery-sun" /><span className="egallery-paper egallery-paper-one">ONE<br />HONEST<br />ATTEMPT</span><span className="egallery-paper egallery-paper-two">YOUR<br />NEXT<br />STEP</span><span className="egallery-chick"><Chick state="happy" size={118} /></span>
      </div>
    </section>

    <section className="egallery-signal" aria-labelledby="signal-title">
      <p className="egallery-eyebrow">THE SIGNAL</p>
      <h2 id="signal-title">More quizzes are not<br />a plan. <em>Evidence is.</em></h2>
      <div className="egallery-signal-grid">
        <article><b>01</b><h3>Attempt</h3><p>Practice an exam-style set—not generic questions.</p></article>
        <article><b>02</b><h3>Understand</h3><p>Know the exact concept and trap behind each lost mark.</p></article>
        <article><b>03</b><h3>Recover</h3><p>Meet the right repair and revision at the right time.</p></article>
      </div>
    </section>

    <section id="your-exam" className="egallery-exam" aria-labelledby="exam-title">
      <div><p className="egallery-eyebrow">YOUR STARTING LINE</p><h2 id="exam-title">Choose your<br /><em>exam.</em></h2><p className="egallery-intro">Your dashboard, questions, countdown and next steps begin with one clear target.</p></div>
      <div className="egallery-picker">
        <div className="egallery-tabs" role="tablist" aria-label="Choose your exam">{exams.map((item) => <button type="button" role="tab" aria-selected={item.slug === exam} key={item.slug} onClick={() => setExam(item.slug)} className={item.slug === exam ? "active" : ""}>{item.label}</button>)}</div>
        <div className={`egallery-choice ${choice.colour}`}><p>YOUR {choice.label} PATH</p><h3>Find the topics<br />costing you marks.</h3><span>{choice.detail}</span><Link href={`/start/${choice.slug}`} onClick={() => trackLandingExamSelected({ exam: choice.slug })}>Begin {choice.label}</Link></div>
      </div>
    </section>

    <section className="egallery-close" aria-labelledby="close-title"><div><p className="egallery-eyebrow">THE FIRST MOVE IS FREE</p><h2 id="close-title">Your preparation<br />can feel <em>clearer.</em></h2><p>Start with one diagnostic. See the story behind your score before you pay for anything.</p><Link href={`/start/${choice.slug}`} onClick={() => trackLandingExamSelected({ exam: choice.slug })} className="egallery-primary">Take my free diagnostic</Link></div><Chick state="excited" size={154} /></section>
    <footer className="egallery-footer"><span>© {new Date().getFullYear()} ExamGrind</span><nav><Link href="/terms">Terms</Link><Link href="/privacy">Privacy</Link><Link href="/contact">Contact</Link></nav></footer>
  </main>;
}
