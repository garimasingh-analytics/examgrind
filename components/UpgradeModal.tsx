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
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: { email?: string; name?: string; contact?: string };
  theme?: { color?: string };
  handler: (resp: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
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
      : reason === "analysis-limit"
      ? "You've used your free analysis"
      : reason === "deep-dive"
      ? "Deep Dive is a paid feature"
      : "Unlock everything";

  const sub =
    reason === "quiz-limit"
      ? `${used ?? "—"} / ${limit ?? 3} free quizzes used. Upgrade to keep practicing.`
      : reason === "analysis-limit"
      ? "Upgrade to keep diagnosing every quiz."
      : reason === "deep-dive"
      ? "Deep Dive uses our most thorough model — exhaustive walkthroughs, second-order patterns, a 7-day plan."
      : "Get the full ExamGrind experience for ₹75 / month.";

  const handleUpgrade = async () => {
    setError(null);
    setLoading(true);
    try {
      // 1. Make sure the Razorpay SDK is on the page.
      const ok = await loadRazorpayScript();
      if (!ok || !window.Razorpay) {
        throw new Error(
          "Couldn't load the payment provider. Check your connection and try again."
        );
      }

      // 2. Ask the server to create a Razorpay order.
      const orderRes = await fetch("/api/billing/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!orderRes.ok) {
        const body = (await orderRes.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(body.error ?? "Couldn't start checkout.");
      }
      const order = (await orderRes.json()) as {
        orderId: string;
        amount: number;
        currency: string;
        key: string;
        name: string;
        description: string;
        prefill?: { email?: string };
      };

      // 3. Open Razorpay Checkout. The user enters card/UPI/etc and
      //    Razorpay calls our handler with the payment proof.
      const rzp = new window.Razorpay({
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        name: order.name,
        description: order.description,
        order_id: order.orderId,
        prefill: order.prefill,
        theme: { color: "#FD7C29" }, // matches our ember accent
        handler: async (resp) => {
          // 4. Hand the proof to the server for HMAC verify + entitlement.
          try {
            const verifyRes = await fetch("/api/billing/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(resp),
            });
            if (!verifyRes.ok) {
              const body = (await verifyRes.json().catch(() => ({}))) as {
                error?: string;
              };
              throw new Error(body.error ?? "Couldn't activate your account.");
            }
            setSuccess(true);
            // Reflect upgraded status across the app.
            router.refresh();
          } catch (e) {
            setError(
              e instanceof Error
                ? e.message
                : "Payment succeeded but activation failed."
            );
          } finally {
            setLoading(false);
          }
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
            What you get for ₹75 / month
          </p>
          <ul className="mt-3 space-y-2.5">
            <Feature>Unlimited quizzes — every subject, every topic</Feature>
            <Feature>Unlimited Deep Analyses on every quiz</Feature>
            <Feature>
              <span className="font-semibold">Deep Dive 👑</span> — exhaustive walkthroughs + 7-day plans
            </Feature>
            <Feature>Drill-the-concept mini-quizzes on tap</Feature>
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
