"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Chick from "@/components/Chick";
import { trackPaidSubscriptionConversion } from "@/lib/google-ads";
import { trackMetaCheckoutStarted, trackMetaSubscriptionPurchase } from "@/lib/meta-ads";
import { trackAccessOptionSelected, trackCheckoutDismissed, trackCheckoutOpened, trackPaywallViewed, trackPurchaseCompleted, trackSubscriptionCheckoutStarted, trackSubscriptionPurchased } from "@/lib/product-analytics";
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
    trackPaywallViewed({ paywall_reason: reason });
  }, [open, reason]);

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
      : "Choose the access that fits today";

  const sub =
    reason === "quiz-limit"
      ? `${used ?? "—"} / ${limit ?? 3} free quizzes used. Upgrade to keep practicing.`
      : reason === "mock-limit"
      ? "Upgrade to take unlimited full-length mocks in real exam conditions."
      : reason === "analysis-limit"
      ? "Upgrade to keep diagnosing every quiz."
      : reason === "deep-dive"
      ? "Deep Dive uses our most thorough model — exhaustive walkthroughs, second-order patterns, a 7-day plan."
      : "Start small with a one-time purchase, or choose Coach for unlimited practice every month.";

  const handleUpgrade = async () => {
    setError(null);
    setLoading(true);
    trackAccessOptionSelected({ product: "coach_monthly", paywall_reason: reason });
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
          trackPurchaseCompleted({ product: "coach_monthly", checkout_type: "subscription" });
          setSuccess(true);
          setLoading(false);
          // Small delay so the webhook has time to land before /me re-fetches.
          setTimeout(() => router.refresh(), 1500);
        },
        modal: {
          ondismiss: () => { trackCheckoutDismissed({ product: "coach_monthly", checkout_type: "subscription" }); setLoading(false); },
        },
      });
      trackCheckoutOpened({ product: "coach_monthly", checkout_type: "subscription" });
      trackMetaCheckoutStarted("coach_monthly");
      rzp.open();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setLoading(false);
    }
  };

  const handleOneTimePurchase = async (product: OneTimeProduct) => {
    setError(null);
    setLoading(true);
    trackAccessOptionSelected({ product, paywall_reason: reason });
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
          if (product === "coach_yearly") {
            trackPaidSubscriptionConversion(resp.razorpay_payment_id, 899);
            trackMetaSubscriptionPurchase(resp.razorpay_payment_id, 899);
            trackSubscriptionPurchased("annual_899");
          }
          trackPurchaseCompleted({ product, checkout_type: "one_time" });
          if (product === "score_boost_21d") router.push("/score-boost");
          else router.refresh();
        },
        modal: { ondismiss: () => { trackCheckoutDismissed({ product, checkout_type: "one_time" }); setLoading(false); } },
      });
      trackCheckoutOpened({ product, checkout_type: "one_time" });
      trackMetaCheckoutStarted(product);
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
        className="relative max-h-[92svh] w-full max-w-md overflow-y-auto rounded-3xl border border-cocoa-900/[0.06] bg-cream-50 shadow-warm-lg"
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
            <div className="rounded-2xl border-2 border-ember-600/35 bg-gradient-to-br from-sun-400/30 via-cream-50 to-ember-500/15 p-4 shadow-warm">
              <div className="flex items-start justify-between gap-3"><div><p className="inline-flex rounded-full bg-ember-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.14em] text-cream-50">Best value</p><p className="mt-3 text-[10px] font-bold uppercase tracking-[.16em] text-ember-700">One payment · full year</p><h3 className="mt-1 font-serif text-2xl font-bold text-cocoa-900">ExamGrind Annual</h3></div><div className="text-right"><p className="font-serif text-3xl font-bold leading-none text-cocoa-900">₹899</p><p className="mt-1 text-xs font-bold text-ember-700">just ₹75 / month</p></div></div>
              <p className="mt-3 text-sm leading-6 text-cocoa-700">Everything is open for the next 12 months—so your preparation never pauses at a paywall.</p>
              <ul className="mt-3 grid gap-1.5 text-xs font-semibold text-cocoa-800 sm:grid-cols-2"><li>✓ Unlimited quizzes & full mocks</li><li>✓ Every AI Deep Analysis</li><li>✓ Coach lessons with licensed visuals</li><li>✓ Ask Coach any concept, then practise it</li><li>✓ Coach, missions & smart revision</li><li>✓ Score Boost + Recovery History</li></ul>
              <p className="mt-3 text-[11px] font-bold text-ember-700">Save ₹1,489 compared with paying ₹199 for 12 separate months.</p>
              <button onClick={() => handleOneTimePurchase("coach_yearly")} disabled={loading || success} className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-cocoa-900 px-4 py-3 text-sm font-bold text-cream-50 shadow-warm transition hover:scale-[1.01] hover:bg-cocoa-800 disabled:cursor-not-allowed disabled:opacity-70">{loading ? "Opening checkout…" : "Get a full year for ₹899"}</button>
              <p className="mt-2 text-center text-[10px] text-cocoa-600">One secure payment through Razorpay · no monthly renewal.</p>
            </div>

            <div className="rounded-2xl border border-cocoa-900/[.10] bg-cream-100 p-4">
              <div className="flex items-baseline justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-cocoa-500">Flexible monthly access</p><h3 className="mt-1 font-bold text-cocoa-900">ExamGrind Coach</h3></div><span className="font-serif text-xl font-bold text-cocoa-900">₹199 <span className="font-sans text-xs font-medium">/ month</span></span></div>
              <p className="mt-2 text-xs leading-5 text-cocoa-700">Need full access for the month ahead? Start here and keep it only while it suits your preparation.</p>
              <p className="mt-2 text-xs font-semibold leading-5 text-cocoa-800">Includes Coach Lesson Studio: type any concept, learn it with a visual walkthrough, then practise it.</p>
              <button onClick={handleUpgrade} disabled={loading || success} className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-cocoa-900/[.12] bg-cream-50 px-4 py-2.5 text-sm font-bold text-cocoa-900 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70">{loading ? "Opening checkout…" : "Choose monthly access"}</button>
              <p className="mt-2 text-center text-[10px] text-cocoa-600">Auto-renews monthly through Razorpay. Cancel anytime from Profile.</p>
            </div>

            <details className="group rounded-2xl border border-cocoa-900/[.08] bg-cream-100/70 p-4">
              <summary className="cursor-pointer list-none text-sm font-bold text-cocoa-900">Need one thing today? <span className="ml-1 text-ember-700 group-open:hidden">See small-access options →</span><span className="ml-1 hidden text-ember-700 group-open:inline">Hide options ↑</span></summary>
              <div className="mt-4 space-y-3 border-t border-cocoa-900/[.08] pt-4">
                <Offer title="1 AI Deep Analysis" price="₹19" detail="A complete breakdown for one finished quiz or mock." fit="One result, fully explained." onClick={() => handleOneTimePurchase("analysis_credit")} disabled={loading || success} />
                <Offer title="Personal 21-Day Score Boost" price="₹49" detail="A fixed roadmap with daily targets and dated revision checkpoints." fit="A focused three-week sprint." onClick={() => handleOneTimePurchase("score_boost_21d")} disabled={loading || success} />
                <div className="grid grid-cols-3 gap-2"><Offer title="3 quizzes" price="₹49" detail="Use anytime" fit="Try again." onClick={() => handleOneTimePurchase("quiz_pack_3")} disabled={loading || success} compact /><Offer title="10 quizzes" price="₹149" detail="Use anytime" fit="Popular." onClick={() => handleOneTimePurchase("quiz_pack_10")} disabled={loading || success} compact /><Offer title="15 quizzes" price="₹199" detail="Use anytime" fit="Best pack." onClick={() => handleOneTimePurchase("quiz_pack_15")} disabled={loading || success} compact /></div>
              </div>
            </details>
          </div>

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
              Your access is active. Refresh the page to continue.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Offer({ title, price, detail, fit, onClick, disabled, compact = false }: { title: string; price: string; detail: string; fit: string; onClick: () => void; disabled: boolean; compact?: boolean }) {
  return <button onClick={onClick} disabled={disabled} className={`w-full rounded-2xl border border-cocoa-900/[0.08] bg-cream-100 text-left transition hover:border-ember-600/35 hover:bg-sun-400/10 disabled:cursor-not-allowed disabled:opacity-60 ${compact ? "p-3" : "p-4"}`}><div className={`flex ${compact ? "flex-col" : "items-baseline justify-between gap-3"}`}><span className="font-bold text-cocoa-900">{title}</span><span className="font-serif text-xl font-bold text-cocoa-900">{price}</span></div><p className="mt-1 text-xs leading-relaxed text-cocoa-700">{detail}</p><p className="mt-2 text-[11px] font-bold text-ember-700">{fit}</p></button>;
}
