"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type SubjectWithProgress = {
  id: string;
  name: string;
  cuet_code: string | null;
  icon: string | null;
  total: number;     // total topics in this subject
  attempted: number; // topics with any attempt
  mastered: number;  // topics at master tier
};

type Props = {
  subjects: SubjectWithProgress[];
};

/**
 * Subject grid with a live search filter on top.
 * Matches against subject name and CUET code (case-insensitive).
 * Server-side computes the progress numbers; this component just filters.
 */
export default function SubjectGrid({ subjects }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return subjects;
    return subjects.filter((s) => {
      if (s.name.toLowerCase().includes(q)) return true;
      if (s.cuet_code?.toLowerCase().includes(q)) return true;
      return false;
    });
  }, [subjects, query]);

  return (
    <>
      {/* Search */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <span
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cocoa-500"
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search subjects…"
            className="w-full rounded-2xl border border-cocoa-900/[0.08] bg-cream-50 py-3 pl-11 pr-4 text-sm text-cocoa-900 placeholder:text-cocoa-500 shadow-warm transition focus:border-ember-600/50 focus:outline-none focus:ring-2 focus:ring-ember-600/20"
            aria-label="Search subjects"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-cocoa-500 transition hover:bg-cream-200 hover:text-cocoa-900"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
        {query && (
          <span className="hidden text-xs text-cocoa-500 sm:inline">
            {filtered.length} of {subjects.length}
          </span>
        )}
      </div>

      {/* Grid or empty state */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((s) => {
            const pct = s.total > 0 ? Math.round((s.attempted / s.total) * 100) : 0;
            return (
              <Link
                key={s.id}
                href={`/subject/${s.id}`}
                className="group flex flex-col rounded-3xl border border-cocoa-900/[0.06] bg-cream-50 p-5 shadow-warm transition hover:-translate-y-0.5 hover:border-cocoa-900/[0.12] hover:bg-white hover:shadow-warm-lg"
              >
                <span className="mb-3 inline-flex size-10 items-center justify-center rounded-xl bg-sun-500/15 font-serif text-lg font-bold text-cocoa-900">
                  {s.icon ?? s.name.charAt(0)}
                </span>
                <h3 className="font-serif text-base font-semibold leading-snug text-cocoa-900">
                  {s.name}
                </h3>
                {s.cuet_code && (
                  <p className="mt-1 text-xs text-cocoa-500">{s.cuet_code}</p>
                )}

                {/* Progress block */}
                {s.total > 0 && (
                  <div className="mt-4">
                    {s.attempted > 0 ? (
                      <>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-cream-200">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-sun-500 to-ember-600 transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <p className="mt-1.5 flex items-center justify-between text-[10px] font-medium text-cocoa-500">
                          <span>
                            {s.attempted} / {s.total} started
                          </span>
                          {s.mastered > 0 && (
                            <span className="font-mono text-ember-700">
                              ✨ {s.mastered}
                            </span>
                          )}
                        </p>
                      </>
                    ) : (
                      <p className="text-[10px] font-medium text-cocoa-500">
                        {s.total} topic{s.total === 1 ? "" : "s"}
                      </p>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl border border-cocoa-900/[0.06] bg-cream-50 p-10 text-center shadow-warm">
          <p className="font-serif text-lg font-semibold text-cocoa-900">
            No subjects match &ldquo;{query}&rdquo;
          </p>
          <p className="mt-1 text-sm text-cocoa-500">
            Try a different word, or clear the search.
          </p>
          <button
            onClick={() => setQuery("")}
            className="mt-4 rounded-2xl border-2 border-cocoa-900/[0.08] bg-cream-50 px-5 py-2.5 text-sm font-bold text-cocoa-900 transition hover:border-cocoa-900/[0.18] hover:bg-white"
          >
            Clear search
          </button>
        </div>
      )}
    </>
  );
}
