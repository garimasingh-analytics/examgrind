"use client";

import { useState, useTransition } from "react";

type Subject = { id: string; name: string };
type Card = { front: string; back: string; hint: string };
type VaultItem = { id: string; item_type: "flashcard_set" | "mnemonic"; topic: string; content: { cards?: Card[]; phrase?: string; explanation?: string }; created_at: string };

export default function VaultStudio({ subjects, initialItems, isCoach, founderPreview }: { subjects: Subject[]; initialItems: VaultItem[]; isCoach: boolean; founderPreview: boolean }) {
  const [topic, setTopic] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [items, setItems] = useState(initialItems);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [pending, startTransition] = useTransition();

  const generate = () => {
    setError(null);
    startTransition(async () => {
      try {
        const response = await fetch("/api/vault/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ topic, subjectId: subjectId || undefined }) });
        const payload = await response.json() as { items?: VaultItem[]; error?: string };
        if (!response.ok || !payload.items) throw new Error(payload.error ?? "Couldn't create study material.");
        setItems((current) => [...payload.items!, ...current]);
        setTopic("");
      } catch (caught) { setError(caught instanceof Error ? caught.message : "Couldn't create study material."); }
    });
  };

  const flashcards = items.filter((item) => item.item_type === "flashcard_set");
  const mnemonics = items.filter((item) => item.item_type === "mnemonic");
  return <>
    <section className="rounded-3xl border border-violet-600/15 bg-gradient-to-br from-violet-600 to-indigo-600 p-5 text-white shadow-warm-lg sm:p-7">
      <p className="text-xs font-bold uppercase tracking-[.18em] text-white/70">Study Vault</p>
      <h1 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">Turn any topic into something you can recall.</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-white/85">Build a compact flashcard set and a useful mnemonic, then keep it here for rapid revision.</p>
      <div className="mt-6 rounded-2xl bg-white/12 p-3 backdrop-blur-sm sm:flex sm:items-center sm:gap-3">
        <input value={topic} onChange={(event) => setTopic(event.target.value)} maxLength={160} placeholder="e.g. Compound interest shortcuts" className="min-w-0 flex-1 rounded-xl border border-white/20 bg-white px-4 py-3 text-sm font-medium text-cocoa-900 outline-none placeholder:text-cocoa-500 focus:ring-2 focus:ring-sun-300" />
        <select value={subjectId} onChange={(event) => setSubjectId(event.target.value)} className="mt-2 rounded-xl border border-white/20 bg-white px-3 py-3 text-sm font-semibold text-cocoa-900 outline-none sm:mt-0">
          <option value="">Any subject</option>{subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
        </select>
        <button type="button" disabled={pending || topic.trim().length < 2} onClick={generate} className="mt-2 w-full rounded-xl bg-sun-400 px-4 py-3 text-sm font-extrabold text-cocoa-900 transition hover:bg-sun-300 disabled:cursor-not-allowed disabled:opacity-60 sm:mt-0 sm:w-auto">{pending ? "Building your set…" : "Create study set"}</button>
      </div>
      {error && <p role="alert" className="mt-3 rounded-xl bg-white/15 px-3 py-2 text-sm font-semibold text-white">{error}</p>}
      {!isCoach && !founderPreview && <p className="mt-3 text-xs text-white/75">Your first saved set is free. ExamGrind Coach unlocks unlimited Study Vault sets.</p>}
      {founderPreview && !isCoach && <p className="mt-3 text-xs text-white/75">Founder preview — student accounts receive one free saved set before Coach.</p>}
    </section>

    <section className="mt-7 grid gap-5 lg:grid-cols-[1.3fr_.7fr]">
      <div className="rounded-3xl border border-cocoa-900/[.08] bg-cream-50 p-5 shadow-warm"><p className="text-xs font-bold uppercase tracking-[.16em] text-cocoa-500">Flashcard sets</p><h2 className="mt-1 font-serif text-2xl font-bold text-cocoa-900">Recall, don&apos;t just reread.</h2>
        {flashcards.length === 0 ? <EmptyState text="Your first set will appear here, ready for fast review." /> : <div className="mt-4 space-y-3">{flashcards.map((set) => <article key={set.id} className="rounded-2xl bg-cream-100 p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-bold text-cocoa-900">{set.topic}</h3><p className="mt-1 text-xs text-cocoa-600">{(set.content.cards ?? []).length} active-recall cards · saved {new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" }).format(new Date(set.created_at))}</p></div><button type="button" onClick={() => setExpanded((current) => ({ ...current, [set.id]: !current[set.id] }))} className="shrink-0 text-xs font-bold text-ember-700">{expanded[set.id] ? "Hide" : "Review"} →</button></div>{expanded[set.id] && <div className="mt-4 grid gap-2">{(set.content.cards ?? []).map((card, index) => <details key={`${set.id}-${index}`} className="rounded-xl border border-cocoa-900/[.07] bg-white p-3"><summary className="cursor-pointer list-none text-sm font-bold text-cocoa-900"><span className="mr-2 text-ember-700">{index + 1}.</span>{card.front}</summary><p className="mt-3 border-t border-cocoa-900/[.06] pt-3 text-sm leading-6 text-cocoa-800">{card.back}</p><p className="mt-2 text-xs italic text-cocoa-500">Hint: {card.hint}</p></details>)}</div>}</article>)}</div>}
      </div>
      <aside className="rounded-3xl border border-cocoa-900/[.08] bg-cream-50 p-5 shadow-warm"><p className="text-xs font-bold uppercase tracking-[.16em] text-cocoa-500">Memory hooks</p><h2 className="mt-1 font-serif text-2xl font-bold text-cocoa-900">Mnemonics</h2>{mnemonics.length === 0 ? <EmptyState text="Useful memory structures will collect here." /> : <div className="mt-4 space-y-3">{mnemonics.map((item) => <article key={item.id} className="rounded-2xl border border-violet-600/15 bg-violet-600/[.06] p-4"><p className="text-xs font-bold uppercase tracking-[.13em] text-violet-600">{item.topic}</p><p className="mt-2 font-serif text-lg font-bold text-cocoa-900">{item.content.phrase}</p><p className="mt-2 text-sm leading-6 text-cocoa-700">{item.content.explanation}</p></article>)}</div>}</aside>
    </section>
  </>;
}

function EmptyState({ text }: { text: string }) { return <p className="mt-4 rounded-2xl bg-cream-100 p-4 text-sm leading-6 text-cocoa-600">{text}</p>; }
