"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Chick from "@/components/Chick";
import { trackPaidSubscriptionConversion } from "@/lib/google-ads";
import { trackMetaSubscriptionPurchase } from "@/lib/meta-ads";
import { trackSubscriptionCheckoutStarted, trackSubscriptionPurchased } from "@/lib/product-analytics";
import type { OneTimeProduct } from "@/lib/billing-products";

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

// Both the modal-open preloader and the purchase button can request this at
// almost the same time. Keep one shared promise so a second caller never
// attaches a `load` listener after the script has already fired its event.
let razorpayScriptPromise: Promise<boolean> | null = null;

function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);
  if (razorpayScriptPromise) return razorpayScriptPromise;

  razorpayScriptPromise = new Promise((resolve) => {
    let settled = false;
    const finish = (ready: boolean) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      if (!ready) razorpayScriptPromise = null; // let a later click retry
      resolve(ready);
    };
    const onLoad = () => finish(Boolean(window.Razorpay));
    const script = document.querySelector(
      `script[src="${CHECKOUT_SRC}"]`
    ) as HTMLScriptElement | null;

    if (script) {
      script.addEventListener("load", onLoad, { once: true });
      script.addEventListener("error", () => finish(false), { once: true });
      // The script may have loaded just before this caller attached listeners.
      // Check again on the next task instead of leaving the checkout disabled.
      window.setTimeout(onLoad, 0);
    } else {
      const newScript = document.createElement("script");
      newScript.src = CHECKOUT_SRC;
      newScript.async = true;
      newScript.onload = onLoad;
      newScript.onerror = () => finish(false);
      document.body.appendChild(newScript);
    }

    const timeout = window.setTimeout(() => finish(false), 12_000);
  });

  return razorpayScriptPromise;
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
    if (!open) return;
    void loadRazorpayScript();
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
      : "Get the full ExamGrind experience for ₹199 / month.";

  const handleUpgrade = async () => {
    setError(null);
    setLoading(true);
    trackSubscriptionCheckoutStarted({ paywall_reason: reason });
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
          sub.description ?? "ExamGrind monthly — auto-renews ₹199",
        prefill: sub.prefill,
        theme: { color: "#FD7C29" },
        handler: (resp) => {
          // Razorpay calls this when the mandate is signed and the
          // first charge has been queued. The DB flip happens via the
          // webhook a moment later — we show a friendly "you're in!"
          // and a refresh once that propagates.
          const transactionId =
            resp.razorpay_payment_id ?? resp.razorpay_subscription_id;
          if (transactionId) {
            trackPaidSubscriptionConversion(transactionId);
            trackMetaSubscriptionPurchase(transactionId);
          }
          trackSubscriptionPurchased();
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

  const handleOneTimePurchase = async (product: OneTimeProduct) => {
    setError(null);
    setLoading(true);
    try {
      // Use the same Razorpay Checkout transport as the working monthly
      // subscription. The only difference is an Order (one charge) rather
      // than a Subscription (a recurring mandate).
      const ok = await loadRazorpayScript();
      if (!ok || !window.Razorpay) {
        throw new Error("Couldn't load the payment provider. Check your connection and try again.");
      }
      const orderRes = await fetch("/api/billing/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product }),
      });
      const order = (await orderRes.json().catch(() => ({}))) as {
        error?: string; orderId?: string; amount?: number; currency?: string;
        key?: string; name?: string; description?: string; prefill?: { email?: string };
      };
      if (!orderRes.ok || !order.orderId || !order.key) {
        throw new Error(order.error ?? "Couldn't start checkout.");
      }
      const rzp = new window.Razorpay({
        key: order.key,
        order_id: order.orderId,
        amount: order.amount,
        currency: order.currency,
        name: order.name ?? "ExamGrind",
        description: order.description ?? "ExamGrind purchase",
        prefill: order.prefill,
        theme: { color: "#FD7C29" },
        handler: async (resp) => {
          if (!resp.razorpay_payment_id || !resp.razorpay_signature || !resp.razorpay_order_id) {
            setError("Payment completed, but verification details were missing. Please contact support.");
            setLoading(false);
            return;
          }
          const verify = await fetch("/api/billing/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(resp),
          });
          const verified = (await verify.json().catch(() => ({}))) as { error?: string };
          if (!verify.ok) {
            setError(verified.error ?? "Your payment needs verification. Please contact support.");
            setLoading(false);
            return;
          }
          setSuccess(true);
          setLoading(false);
          if (product === "score_boost_21d") router.push("/score-boost");
          else router.refresh();
        },
        modal: { ondismiss: () => setLoading(false) },
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
          <div className="space-y-3">
            <Offer title="1 AI Deep Analysis" price="₹19" detail="Find weak concepts, score impact and the next action for one completed quiz or mock." fit="Best for one result." onClick={() => handleOneTimePurchase("analysis_credit")} disabled={loading || success} />
            <Offer title="Personal 21-Day Score Boost" price="₹49" detail="A fixed weak-topic roadmap with daily targets and dated revision checkpoints. No auto-renewal." fit="Best for a focused sprint." onClick={() => handleOneTimePurchase("score_boost_21d")} disabled={loading || success} />
            <div className="rounded-2xl border border-ember-600/20 bg-sun-400/10 p-4">
              <div className="flex items-baseline justify-between gap-3"><h3 className="font-bold text-cocoa-900">ExamGrind Coach</h3><span className="font-serif text-xl font-bold text-cocoa-900">₹199 <span className="font-sans text-xs font-medium">/ month</span></span></div>
              <p className="mt-1 text-xs leading-relaxed text-cocoa-700">Unlimited quizzes, mocks and Deep Analyses, plus adaptive plans and every ongoing premium tool.</p>
              <p className="mt-2 text-[11px] font-bold text-ember-700">Best value for regular practice.</p>
              <button onClick={handleUpgrade} disabled={loading || success} className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-br from-sun-400 via-sun-500 to-ember-500 px-4 py-2.5 text-sm font-bold text-cocoa-900 shadow-warm transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70">{loading ? "Opening checkout…" : "Upgrade to Coach"}</button>
            </div>
          </div>
          <p className="mt-3 text-center text-[11px] text-cocoa-500">A rewarded ad option will appear here only after ad approval and verified completion are available.</p>

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

function Offer({ title, price, detail, fit, onClick, disabled }: { title: string; price: string; detail: string; fit: string; onClick: () => void; disabled: boolean }) {
  return <button onClick={onClick} disabled={disabled} className="w-full rounded-2xl border border-cocoa-900/[0.08] bg-cream-100 p-4 text-left transition hover:border-ember-600/35 hover:bg-sun-400/10 disabled:cursor-not-allowed disabled:opacity-60"><div className="flex items-baseline justify-between gap-3"><span className="font-bold text-cocoa-900">{title}</span><span className="font-serif text-xl font-bold text-cocoa-900">{price}</span></div><p className="mt-1 text-xs leading-relaxed text-cocoa-700">{detail}</p><p className="mt-2 text-[11px] font-bold text-ember-700">{fit}</p></button>;
}
