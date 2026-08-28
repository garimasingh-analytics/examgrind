"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Chick from "@/components/Chick";
import { trackDiagnosisHandoffAction, trackDiagnosisHandoffViewed } from "@/lib/product-analytics";

const HANDOFF_KEY = "examgrind:public-diagnosis-handoff";
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

type Handoff = {
  exam: string;
  concept: string;
  subjectId: string;
  wrongCount: number;
  createdAt: number;
};

function isHandoff(value: unknown): value is Handoff {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<Handoff>;
  return typeof candidate.exam === "string" &&
    typeof candidate.concept === "string" &&
    typeof candidate.subjectId === "string" &&
    typeof candidate.wrongCount === "number" &&
    typeof candidate.createdAt === "number";
}

export default function DiagnosisHandoffCard({ examSlug }: { examSlug: string }) {
  const [handoff, setHandoff] = useState<Handoff | null>(null);
  const hasTrackedView = useRef(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(HANDOFF_KEY);
      if (!raw) return;
      const parsed: unknown = JSON.parse(raw);
      if (!isHandoff(parsed) || parsed.exam !== examSlug || Date.now() - parsed.createdAt > MAX_AGE_MS) {
        window.localStorage.removeItem(HANDOFF_KEY);
        return;
      }
      setHandoff(parsed);
      if (!hasTrackedView.current) {
        hasTrackedView.current = true;
        trackDiagnosisHandoffViewed({
          exam: parsed.exam as "cuet" | "ssc-cgl" | "neet-ug" | "delhi-police-constable",
          wrong_count: parsed.wrongCount,
        });
      }
    } catch {
      window.localStorage.removeItem(HANDOFF_KEY);
    }
  }, [examSlug]);

  if (!handoff) return null;

  const dismiss = (action: "choose_subject" | "dismiss" = "dismiss") => {
    trackDiagnosisHandoffAction({
      exam: handoff.exam as "cuet" | "ssc-cgl" | "neet-ug" | "delhi-police-constable",
      action,
    });
    window.localStorage.removeItem(HANDOFF_KEY);
    setHandoff(null);
  };

  return (
    <section className="mx-auto max-w-5xl px-4 pt-4 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl border border-coral-500/30 bg-gradient-to-br from-coral-500/[0.13] via-cream-50 to-sun-400/[0.16] p-5 shadow-warm sm:p-6">
        <button type="button" onClick={() => dismiss()} className="absolute right-4 top-3 text-xs font-bold text-cocoa-500 hover:text-cocoa-900" aria-label="Dismiss diagnosis handoff">Not now ×</button>
        <div className="flex items-start gap-4 pr-16">
          <Chick state="excited" size={62} className="shrink-0" />
          <div className="min-w-0">
            <p className="eg-kicker text-ember-700">Your quick diagnosis came with you</p>
            <h2 className="mt-1 font-serif text-2xl font-semibold leading-tight tracking-[-.04em] text-cocoa-900 sm:text-3xl">Start with {handoff.concept}—or choose your own route.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-cocoa-700">The five-question sample surfaced {handoff.wrongCount === 1 ? "one concept gap" : `${handoff.wrongCount} concept gaps`}. It is a useful first signal, not a decision made for you.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href={`/subject/${handoff.subjectId}`} onClick={() => trackDiagnosisHandoffAction({ exam: handoff.exam as "cuet" | "ssc-cgl" | "neet-ug" | "delhi-police-constable", action: "follow_signal" })} className="eg-press inline-flex rounded-2xl bg-cocoa-900 px-4 py-2.5 text-sm font-bold text-cream-50 shadow-warm hover:bg-cocoa-700">Follow this signal →</Link>
              <Link href="#subjects" onClick={() => dismiss("choose_subject")} className="inline-flex rounded-2xl border border-cocoa-900/15 bg-cream-50 px-4 py-2.5 text-sm font-bold text-cocoa-900 hover:bg-cream-100">I&apos;ll choose my subject</Link>
              <Link href={`/guides?exam=${handoff.exam}`} onClick={() => { trackDiagnosisHandoffAction({ exam: handoff.exam as "cuet" | "ssc-cgl" | "neet-ug" | "delhi-police-constable", action: "read_guide" }); window.localStorage.removeItem(HANDOFF_KEY); }} className="inline-flex rounded-2xl border border-cocoa-900/15 bg-cream-50 px-4 py-2.5 text-sm font-bold text-cocoa-900 hover:bg-cream-100">Read my study guide</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
