"use client";

import { useEffect, useState } from "react";
import Chick from "@/components/Chick";

/**
 * The public landing's signature motion object. It is intentionally CSS-only:
 * no canvas, video, or heavy animation runtime is needed for a book-like reveal
 * that remains fast on a mid-range Android phone.
 */
export default function LandingBook() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setOpen(true), 520);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <button
      type="button"
      onClick={() => setOpen((value) => !value)}
      className={`landing-book-scene ${open ? "is-open" : ""}`}
      aria-label={open ? "Close the ExamGrind study book" : "Open the ExamGrind study book"}
    >
      <span className="landing-book-shadow" aria-hidden />
      <span className="landing-book-back" aria-hidden />
      <span className="landing-book-pages" aria-hidden />
      <span className="landing-book-cover">
        <span className="landing-book-spine" aria-hidden />
        <span className="landing-book-cover-copy">
          <span className="landing-book-kicker">ExamGrind</span>
          <span className="landing-book-title">YOUR<br />NEXT<br />CHAPTER</span>
          <span className="landing-book-mark">01</span>
        </span>
      </span>
      <span className="landing-book-open-page">
        <span className="landing-book-open-kicker">TODAY&apos;S SIGNAL</span>
        <span className="landing-book-open-title">Know what<br />earns marks.</span>
        <span className="landing-book-chick"><Chick state="excited" size={70} /></span>
        <span className="landing-book-open-line" aria-hidden />
        <span className="landing-book-open-small">Tap to turn the page</span>
      </span>
    </button>
  );
}
