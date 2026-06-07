"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Floating feedback widget — small "Send feedback" button fixed to the
 * bottom-right of every page. Click → modal with a textarea + optional
 * email + Send. POSTs to /api/feedback, persists, fires alert.
 *
 * Why bottom-right and not in the footer:
 *   Students have a problem mid-quiz / mid-mock and the urge to
 *   complain is HIGH right then. A floating widget on every page
 *   catches that moment. A footer link gets ignored.
 *
 * Hidden surfaces:
 *   - /quiz/[id] and /mock/take/[attemptId] hide the widget because
 *     the strict mode UI shouldn't have a floating button that breaks
 *     exam realism. They can still send feedback after they submit.
 *   - /admin hides it because the founder reading feedback doesn't
 *     need to feedback themselves.
 */
export default function FeedbackWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hide on strict-mode quiz/mock screens and on /admin.
  const hidden =
    pathname?.startsWith("/quiz/") ||
    pathname?.startsWith("/mock/take/") ||
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/share/");

  // Reset success state when the modal is closed and re-opened.
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setSent(false);
        setError(null);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  if (hidden) return null;

  const send = async () => {
    setError(null);
    if (!message.trim()) {
      setError("Type something first 🙏");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message.trim(),
          email: email.trim() || undefined,
          sourcePath: pathname,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body.error ?? "Couldn't send. Try again in a moment.");
        return;
      }
      setSent(true);
      setMessage("");
      // Auto-close after a beat so user sees the confirmation.
      setTimeout(() => setOpen(false), 1800);
    } catch {
      setError("Network error. Check your connection.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Floating trigger */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-cocoa-900 px-4 py-2.5 text-xs font-bold text-cream-50 shadow-warm-lg transition hover:scale-[1.03] sm:bottom-6 sm:right-6 sm:px-5 sm:py-3 sm:text-sm"
        aria-label="Send feedback"
        title="Found a bug? Want a feature? Tell us!"
      >
        <span aria-hidden>💬</span>
        <span>Feedback</span>
      </button>

      {/* Modal */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="feedback-title"
          className="fixed inset-0 z-50 flex items-end justify-center bg-cocoa-900/40 px-3 py-6 sm:items-center sm:px-6"
          onClick={() => !sending && setOpen(false)}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-3xl border border-cocoa-900/[0.06] bg-cream-50 shadow-warm-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-sun-400/30 via-sun-500/20 to-ember-500/20 px-5 py-4 sm:px-6 sm:py-5">
              <h2
                id="feedback-title"
                className="font-serif text-xl font-bold text-cocoa-900 sm:text-2xl"
              >
                {sent ? "Got it — thank you! 🙏" : "Tell us what's up"}
              </h2>
              <p className="mt-1 text-xs text-cocoa-700 sm:text-sm">
                {sent
                  ? "We read every single one. We'll get back to you if you left an email."
                  : "Bug, feature idea, something feels off — we want to know. Founder reads every message."}
              </p>
            </div>

            {/* Body */}
            <div className="px-5 py-4 sm:px-6 sm:py-5">
              {!sent && (
                <>
                  <label
                    htmlFor="feedback-message"
                    className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-cocoa-500"
                  >
                    Your message
                  </label>
                  <textarea
                    id="feedback-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="What happened? What were you trying to do?"
                    rows={5}
                    maxLength={5000}
                    disabled={sending}
                    className="mt-1.5 w-full rounded-2xl border border-cocoa-900/[0.10] bg-cream-50 p-3 text-sm text-cocoa-900 placeholder:text-cocoa-500 focus:border-ember-500 focus:outline-none focus:ring-2 focus:ring-ember-500/30 disabled:opacity-60"
                  />

                  <label
                    htmlFor="feedback-email"
                    className="mt-4 block text-[10px] font-semibold uppercase tracking-[0.18em] text-cocoa-500"
                  >
                    Email (optional — so we can reply)
                  </label>
                  <input
                    id="feedback-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    disabled={sending}
                    className="mt-1.5 w-full rounded-2xl border border-cocoa-900/[0.10] bg-cream-50 px-3 py-2.5 text-sm text-cocoa-900 placeholder:text-cocoa-500 focus:border-ember-500 focus:outline-none focus:ring-2 focus:ring-ember-500/30 disabled:opacity-60"
                  />

                  {error && (
                    <p
                      role="alert"
                      className="mt-3 rounded-xl bg-ember-600/10 px-3 py-2 text-xs font-medium text-ember-700"
                    >
                      {error}
                    </p>
                  )}

                  <div className="mt-5 flex items-center gap-2">
                    <button
                      onClick={send}
                      disabled={sending || !message.trim()}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-ember-500 to-coral-500 px-5 py-2.5 text-sm font-bold text-cream-50 shadow-warm transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {sending ? (
                        <>
                          <span className="inline-block size-4 animate-spin rounded-full border-2 border-cream-50/40 border-t-cream-50" />
                          <span>Sending…</span>
                        </>
                      ) : (
                        <>
                          <span aria-hidden>📨</span>
                          <span>Send</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setOpen(false)}
                      disabled={sending}
                      className="rounded-2xl px-4 py-2.5 text-sm font-medium text-cocoa-500 transition hover:text-cocoa-900 disabled:opacity-60"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}

              {sent && (
                <div className="py-6 text-center">
                  <p className="text-4xl">🎉</p>
                  <p className="mt-2 text-sm text-cocoa-700">
                    Closing in a sec…
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
