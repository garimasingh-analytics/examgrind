"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Chick from "@/components/Chick";

// Razorpay's checkout SDK injects itself into window when the script loads.
declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void };
  }
}

type RazorpayOptions = {
  key: string;
  // In subscription mode we pass subscription_id, NOT amount/order_id.
  subscription_id?: string;
  amount?: number;
  currency?: string;
  name: string;
  description: string;
  order_id?: string;
  prefill?: { email?: string; name?: string; contact?: string };
  theme?: { color?: string };
  // Subscription mode hands back a payment + subscription id pair;
  // we don't need to verify a signature client-side since the webhook
  // is the source of truth.
  handler: (resp: {
    razorpay_payment_id?: string;
    razorpay_subscription_id?: string;
    razorpay_signature?: string;
    razorpay_order_id?: string;
  }) => void;
  modal?: { ondismiss?: () => void };
};

const CHECKOUT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);
    const existing = document.querySelector(
      `script[src="${CHECKOUT_SRC}"]`
    ) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }
    const s = document.createElement("script");
    s.src = CHECKOUT_SRC;
    s.async = true;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export type PaywallReason =
  | "quiz-limit"
  | "mock-limit"
  | "analysis-limit"
  | "deep-dive"
  | "manual"; // direct "Upgrade" click

type Props = {
  open: boolean;
  onClose: () => void;
  reason: PaywallReason;
  /** Optional usage data for the headline ("3 of 3 used"). */
  used?: number;
  limit?: number;
};

/**
 * One modal to gate everything. Different `reason` → different headline,
 * same body and CTA. Razorpay checkout swaps in here when wired.
 */
export default function UpgradeModal({
  open,
  onClose,
  reason,
  used,
  limit,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // Preload the Razorpay checkout script as soon as the modal opens so
  // the click feels instant. No-op if it's already loaded.
  useEffect(() => {
    if (open) void loadRazorpayScript();
  }, [open]);

  if (!open) return null;

  const headline =
    reason === "quiz-limit"
      ? "You've used your 3 free quizzes"
      : reason === "mock-limit"
      ? "You've used your free mock test"
      : reason === "analysis-limit"
      ? "You've used your free analysis"
      : reason === "deep-dive"
      ? "Deep Dive is a paid feature"
      : "Unlock everything";

  const sub =
    reason === "quiz-limit"
      ? `${used ?? "—"} / ${limit ?? 3} free quizzes used. Upgrade to keep practicing.`
      : reason === "mock-limit"
      ? "Upgrade to take unlimited full-length mocks in real exam conditions."
      : reason === "analysis-limit"
      ? "Upgrade to keep diagnosing every quiz."
      : reason === "deep-dive"
      ? "Deep Dive uses our most thorough model — exhaustive walkthroughs, second-order patterns, a 7-day plan."
      : "Get the full ExamGrind experience for ₹75 / month.";

  const handleUpgrade = async () => {
    setError(null);
    setLoading(true);
    try {
      // 1. Razorpay SDK
      const ok = await loadRazorpayScript();
      if (!ok || !window.Razorpay) {
        throw new Error(
          "Couldn't load the payment provider. Check your connection and try again."
        );
      }

      // 2. Server creates a Razorpay Subscription (UPI Autopay-eligible).
      const subRes = await fetch("/api/billing/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!subRes.ok) {
        const body = (await subRes.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(body.error ?? "Couldn't start subscription.");
      }
      const sub = (await subRes.json()) as {
        subscriptionId: string;
        key: string;
        name?: string;
        description?: string;
        prefill?: { email?: string };
        alreadyActive?: boolean;
      };

      if (sub.alreadyActive) {
        // User already paid up — just refresh /me to show their plan.
        setSuccess(true);
        setLoading(false);
        router.refresh();
        return;
      }

      // 3. Open Razorpay Checkout in SUBSCRIPTION mode. User signs the
      //    UPI / card mandate. Razorpay handles the rest async — our
      //    webhook updates state when subscription.activated fires.
      const rzp = new window.Razorpay({
        key: sub.key,
        subscription_id: sub.subscriptionId,
        name: sub.name ?? "ExamGrind",
        description:
          sub.description ?? "ExamGrind monthly — auto-renews ₹75",
        prefill: sub.prefill,
        theme: { color: "#FD7C29" },
        handler: () => {
          // Razorpay calls this when the mandate is signed and the
          // first charge has been queued. The DB flip happens via the
          // webhook a moment later — we show a friendly "you're in!"
          // and a refresh once that propagates.
          setSuccess(true);
          setLoading(false);
          // Small delay so the webhook has time to land before /me re-fetches.
          setTimeout(() => router.refresh(), 1500);
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      });
      rzp.open();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="upgrade-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-cocoa-900/40 px-4 sm:px-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-cocoa-900/[0.06] bg-cream-50 shadow-warm-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-sun-400/30 via-sun-500/20 to-ember-500/20 p-6 text-center">
          <Chick state="excited" size={96} className="mx-auto" />
          <h2
            id="upgrade-modal-title"
            className="mt-3 font-serif text-2xl font-bold leading-tight text-cocoa-900 sm:text-3xl"
          >
            {headline}
          </h2>
          <p className="mt-2 text-sm text-cocoa-700">{sub}</p>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cocoa-500">
            ₹75 / month · Auto-renews via UPI · Cancel any time
          </p>
          <ul className="mt-3 space-y-2.5">
            <Feature>Unlimited quizzes — every subject, every topic</Feature>
            <Feature>Unlimited full-length mock tests — real exam UX</Feature>
            <Feature>Unlimited Deep Analyses on every quiz</Feature>
            <Feature>
              <span className="font-semibold">Deep Dive 👑</span> — exhaustive walkthroughs + 7-day plans
            </Feature>
            <Feature>Priority on every new feature</Feature>
          </ul>

          <button
            onClick={handleUpgrade}
            disabled={loading || success}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-sun-400 via-sun-500 to-ember-500 px-6 py-3.5 text-sm font-bold text-cocoa-900 shadow-warm-lg transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <span>👑</span>
            <span>
              {success
                ? "You're paid up! 🎉"
                : loading
                ? "Opening checkout…"
                : "Upgrade — ₹75 / month"}
            </span>
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="mt-2 inline-flex w-full items-center justify-center rounded-2xl px-6 py-2.5 text-sm font-medium text-cocoa-500 transition hover:text-cocoa-900 disabled:opacity-50"
          >
            {success ? "Close" : "Maybe later"}
          </button>

          {error && (
            <p
              role="alert"
              className="mt-3 rounded-xl bg-ember-600/10 px-4 py-2.5 text-center text-xs font-medium text-ember-700"
            >
              {error}
            </p>
          )}
          {success && (
            <p
              role="status"
              className="mt-3 rounded-xl bg-moss-500/15 px-4 py-2.5 text-center text-xs font-medium text-moss-700"
            >
              Welcome aboard! Refresh the page to start unlimited practice.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Feature({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <span
        className="mt-1 flex size-4 shrink-0 items-center justify-center rounded-full bg-ember-600 text-[10px] font-bold text-cream-50"
        aria-hidden="true"
      >
        ✓
      </span>
      <span className="text-sm text-cocoa-900">{children}</span>
    </li>
  );
}
