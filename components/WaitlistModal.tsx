"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";

/**
 * Waitlist modal — wraps any clickable trigger and opens a centered
 * dialog asking for an email + optional notification preference.
 *
 * Posts to /api/waitlist with { email, exam_slug }. The coaching centre
 * branding flows through the B2B subscription, NOT through this signup,
 * so we deliberately keep the form minimal — every extra field hurts
 * conversion on a free-tier signup form.
 *
 * Three status modes change the copy:
 *   - "waitlist"    → "You'll be the first to know when X launches."
 *   - "coming_soon" → "Tell us this is the exam you want — votes shape our roadmap."
 *   - "suggest"     → free-text input for "which exam should we add"
 */
type Status = "waitlist" | "coming_soon" | "suggest";

type Props = {
  slug: string;
  examName: string;
  status: Status;
  children: ReactNode;
};

export default function WaitlistModal({ slug, examName, status, children }: Props) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Esc-to-close — small touch that makes the modal feel native
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          exam_slug: status === "suggest" ? `suggest:${suggestion.trim()}` : slug,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Could not save. Try again?");
      }
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const headline =
    status === "suggest"
      ? "Which exam should we add next?"
      : status === "coming_soon"
      ? `${examName} — coming soon.`
      : `${examName} is launching soon.`;

  const subhead =
    status === "suggest"
      ? "Drop the exam name + your email. Votes shape our roadmap."
      : status === "coming_soon"
      ? "Add your email and we'll let you know the moment it's live. No spam."
      : "Be first in line when it launches. We'll send one email — no spam.";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block h-full w-full text-left"
      >
        {children}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-cocoa-900/60 p-4"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="w-full max-w-md rounded-3xl bg-cream-50 p-6 shadow-warm-lg sm:p-8">
            {!done ? (
              <>
                <h3 className="font-serif text-2xl font-bold text-cocoa-900">
                  {headline}
                </h3>
                <p className="mt-2 text-sm text-cocoa-700">{subhead}</p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-3">
                  {status === "suggest" && (
                    <input
                      required
                      value={suggestion}
                      onChange={(e) => setSuggestion(e.target.value)}
                      placeholder="Exam name (e.g. NEET PG, GATE CSE)"
                      className="w-full rounded-2xl border border-cocoa-900/[0.08] bg-white px-4 py-3 text-sm text-cocoa-900 placeholder:text-cocoa-500 focus:border-ember-600 focus:outline-none"
                    />
                  )}
                  <input
                    required
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-cocoa-900/[0.08] bg-white px-4 py-3 text-sm text-cocoa-900 placeholder:text-cocoa-500 focus:border-ember-600 focus:outline-none"
                  />

                  {error && (
                    <p className="text-sm text-coral-500" role="alert">
                      {error}
                    </p>
                  )}

                  <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
                    <button
                      type="submit"
                      disabled={busy}
                      className="inline-flex items-center justify-center rounded-2xl bg-ember-600 px-6 py-3 text-sm font-bold text-cream-50 shadow-warm transition hover:bg-ember-700 disabled:opacity-60"
                    >
                      {busy ? "Saving…" : "Add me to the list"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="text-sm font-medium text-cocoa-500 hover:text-cocoa-900"
                    >
                      Maybe later
                    </button>
                  </div>
                </form>
              </>
            ) : (
              // Confirmation state — short, warm, gets out of the way
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-moss-500/15 text-3xl">
                  ✓
                </div>
                <h3 className="font-serif text-2xl font-bold text-cocoa-900">
                  You&apos;re on the list.
                </h3>
                <p className="mt-2 text-sm text-cocoa-700">
                  We&apos;ll email you the moment {examName} is live.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    // Reset so the modal works again next time
                    setTimeout(() => {
                      setDone(false);
                      setEmail("");
                      setSuggestion("");
                    }, 250);
                  }}
                  className="mt-6 inline-flex items-center justify-center rounded-2xl bg-cocoa-900 px-6 py-3 text-sm font-bold text-cream-50 transition hover:bg-cocoa-700"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
