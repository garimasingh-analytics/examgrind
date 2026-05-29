"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type ExamOption = { slug: string; name: string };

const EXAMS: ExamOption[] = [
  { slug: "cuet", name: "CUET UG" },
  { slug: "ssc-cgl", name: "SSC CGL" },
  { slug: "neet-ug", name: "NEET UG" },
];

const NAMES: Record<string, string> = Object.fromEntries(
  EXAMS.map((e) => [e.slug, e.name])
);

/**
 * Compact header pill that doubles as a one-click exam switcher.
 *
 * - Closed state: small pill showing the current exam name + a small ▾.
 * - Open state: popover listing all 3 exams. Clicking one navigates to
 *   /start/<slug>, which server-side updates users.exam_choice and
 *   redirects to /home. XP and streak are preserved.
 *
 * Used in headers across /home, /results/[id], and anywhere else a user
 * might want to switch exams mid-session.
 */
export default function ExamSwitcher({
  currentSlug,
}: {
  currentSlug: string;
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const currentName = NAMES[currentSlug] ?? "CUET UG";

  // Click-outside dismissal
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        title="Switch exam"
        className="inline-flex items-center gap-1 rounded-full bg-moss-500/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-moss-700 transition hover:bg-moss-500/25"
      >
        <span>{currentName}</span>
        <span aria-hidden className={`text-[9px] transition ${open ? "rotate-180" : ""}`}>
          ▾
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-cocoa-900/[0.08] bg-cream-50 shadow-warm-lg"
        >
          <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-cocoa-500">
            Switch exam
          </div>
          <ul className="pb-1">
            {EXAMS.map((e) => {
              const active = e.slug === currentSlug;
              return (
                <li key={e.slug}>
                  <Link
                    role="menuitem"
                    href={`/start/${e.slug}`}
                    className={`flex items-center justify-between gap-2 px-3 py-2 text-sm transition ${
                      active
                        ? "bg-cocoa-900/[0.04] font-semibold text-cocoa-900"
                        : "text-cocoa-700 hover:bg-warm-wash"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    <span>{e.name}</span>
                    {active && (
                      <span aria-hidden className="text-xs text-moss-700">
                        ✓
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="border-t border-cocoa-900/[0.06] px-3 py-2 text-[11px] text-cocoa-500">
            Your XP and streak come with you.
          </div>
        </div>
      )}
    </div>
  );
}
