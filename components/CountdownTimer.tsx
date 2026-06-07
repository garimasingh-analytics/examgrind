"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Real-exam countdown timer.
 *
 * Owns the only authoritative time-remaining state for the mock test.
 * The parent must NOT mirror it into its own state — that creates
 * render-driven drift. Instead, parent listens to onTick / onExpire.
 *
 * Behaviour:
 *   - Ticks once per second using a single setInterval pinned to a ref.
 *   - Pauses when the tab is hidden (visibilitychange) so we don't burn
 *     wall-clock seconds while the user is alt-tabbed. The strict-mode
 *     rule "closing the tab = abandoned" is enforced server-side, not
 *     by burning timer here.
 *   - Calls onExpire exactly once when seconds reach 0.
 *   - Turns ember-red in the final 5 minutes for a visceral panic cue.
 *
 * The countdown is *display* state. The server validates the real
 * elapsed time against started_at on submit, so a client that lies
 * about its timer can't claim a 6-hour mock.
 */

type Props = {
  /** Seconds remaining when this component mounts. */
  initialSeconds: number;
  /** Called once when seconds reach 0. */
  onExpire: () => void;
  /** Optional — emitted every second with current seconds remaining. */
  onTick?: (secondsLeft: number) => void;
};

function format(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

export default function CountdownTimer({
  initialSeconds,
  onExpire,
  onTick,
}: Props) {
  const [seconds, setSeconds] = useState(Math.max(0, initialSeconds));
  // The expire callback must fire exactly once even if the parent
  // re-renders and changes the prop identity.
  const expiredRef = useRef(false);
  // Hold the latest callbacks in refs so the interval closure stays
  // stable — re-creating the interval on every parent re-render would
  // drop ticks.
  const onExpireRef = useRef(onExpire);
  const onTickRef = useRef(onTick);
  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);
  useEffect(() => {
    onTickRef.current = onTick;
  }, [onTick]);

  useEffect(() => {
    const id = window.setInterval(() => {
      // Don't tick down while the page is hidden — see header comment.
      if (typeof document !== "undefined" && document.hidden) return;
      setSeconds((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          if (!expiredRef.current) {
            expiredRef.current = true;
            onExpireRef.current();
          }
          return 0;
        }
        onTickRef.current?.(next);
        return next;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const danger = seconds <= 5 * 60; // last 5 minutes
  const critical = seconds <= 60;

  return (
    <div
      role="timer"
      aria-live="off"
      className={[
        "inline-flex items-center gap-2 rounded-2xl px-3.5 py-2 text-sm font-bold tabular-nums shadow-warm transition-colors",
        critical
          ? "bg-ember-600 text-cream-50"
          : danger
          ? "bg-ember-500/15 text-ember-700"
          : "bg-cocoa-900 text-cream-50",
      ].join(" ")}
    >
      <span aria-hidden="true">⏱</span>
      <span>{format(seconds)}</span>
    </div>
  );
}
