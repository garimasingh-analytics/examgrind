"use client";

import Chick, { type ChickState } from "./Chick";

const MOMENTS: Array<{ state: ChickState; title: string; copy: string }> = [
  { state: "idle", title: "Learn", copy: "Sits with you while you understand something new." },
  { state: "happy", title: "Got it", copy: "Shows up when a difficult idea finally clicks." },
  { state: "frustrated", title: "Repair", copy: "Keeps you focused when a mistake needs another try." },
  { state: "sad", title: "Reset", copy: "A bad score is a signal, not the end of your day." },
  { state: "excited", title: "Celebrate", copy: "Flutters when you finish a real piece of work." },
];

export default function ChickPicker() {
  return (
    <section className="mt-8" aria-labelledby="study-buddy-title">
      <h2 id="study-buddy-title" className="text-xl font-display font-bold text-cocoa-900 mb-1">
        Your study buddy
      </h2>
      <p className="text-sm text-cocoa-500 mb-4">
        The same little coach follows your preparation: calm while you learn, focused when you repair, and very happy when you improve.
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {MOMENTS.map((moment) => (
          <article
            key={moment.title}
            className="flex min-h-48 flex-col items-center rounded-2xl border border-cocoa-900/[0.08] bg-cream-50 p-4 text-center shadow-warm"
          >
            <Chick state={moment.state} size={88} />
            <h3 className="mt-2 text-sm font-semibold text-cocoa-900">{moment.title}</h3>
            <p className="mt-1 text-xs leading-5 text-cocoa-500">{moment.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
