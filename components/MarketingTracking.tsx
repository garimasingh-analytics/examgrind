"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import MetaPixel from "@/components/MetaPixel";
import { trackSignUpConversion } from "@/lib/google-ads";
import { trackDiagnosisSignupCompleted, trackLogin, trackSignUp } from "@/lib/product-analytics";
import { GOOGLE_ADS_ID } from "@/components/GoogleAdsTag";

const CONSENT_KEY = "examgrind-marketing-consent-v1";
type Consent = "granted" | "denied" | null;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __examgrindMarketingConsent?: "granted" | "denied";
    __examgrindGoogleAnalyticsReady?: boolean;
  }
}

const googleConsent = (value: Exclude<Consent, null>) => {
  window.gtag?.("consent", "update", {
    ad_storage: value,
    ad_user_data: value,
    ad_personalization: value,
    analytics_storage: value,
  });
};

/** Keeps non-essential tracking off the page until the visitor opts in. */
export default function MarketingTracking() {
  const [consent, setConsent] = useState<Consent>(null);
  const [ready, setReady] = useState(false);
  const [analyticsReady, setAnalyticsReady] = useState(false);

  useEffect(() => {
    // Set the secure default before a visitor makes a choice. This queue is
    // later consumed by the Google tag only after the visitor has opted in.
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || ((...args: unknown[]) => window.dataLayer?.push(args));
    window.gtag("consent", "default", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
    });

    const saved = window.localStorage.getItem(CONSENT_KEY);
    if (saved === "granted" || saved === "denied") {
      window.__examgrindMarketingConsent = saved;
      setConsent(saved);
    }
    setReady(true);

    const openSettings = () => {
      // Opening settings withdraws the earlier choice until the visitor makes
      // a new one. This immediately blocks product events and tells Google to
      // stop optional storage while the banner is visible.
      window.__examgrindMarketingConsent = "denied";
      googleConsent("denied");
      setConsent(null);
      window.localStorage.removeItem(CONSENT_KEY);
    };
    window.addEventListener("examgrind:open-cookie-settings", openSettings);
    return () => window.removeEventListener("examgrind:open-cookie-settings", openSettings);
  }, []);

  const save = (value: Exclude<Consent, null>) => {
    window.localStorage.setItem(CONSENT_KEY, value);
    window.__examgrindMarketingConsent = value;
    setConsent(value);
    googleConsent(value);
    window.dispatchEvent(new Event("examgrind:marketing-consent"));
  };

  return (
    <>
      <GoogleTag onReady={() => setAnalyticsReady(true)} />

      {consent === "granted" && (
        <>
          <MetaPixel />
          {analyticsReady && <AuthLifecycleEvent />}
        </>
      )}

      {ready && consent === null && (
        <section
          className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-xl rounded-2xl border border-cocoa-900/10 bg-cream-50 p-4 shadow-[0_16px_50px_rgba(55,32,21,0.2)] sm:bottom-5 sm:p-5"
          aria-label="Cookie preferences"
          role="dialog"
        >
          <p className="font-semibold text-cocoa-900">Your privacy choices</p>
          <p className="mt-1 text-sm leading-6 text-cocoa-600">
            ExamGrind needs essential cookies to keep you signed in. With your
            permission, we use Google Analytics, Google Ads and Meta Pixel to
            understand visits and improve our ads. Before you choose, Google
            receives only a privacy-safe consent signal—never quiz answers,
            payment details, or marketing cookies.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => save("denied")} className="rounded-xl border border-cocoa-900/15 px-4 py-2.5 text-sm font-semibold text-cocoa-700 transition hover:bg-cream-100">
              Reject non-essential
            </button>
            <button type="button" onClick={() => save("granted")} className="rounded-xl bg-coral-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-coral-600">
              Accept analytics & ads
            </button>
          </div>
          <a href="/privacy" className="mt-3 inline-block text-xs font-medium text-cocoa-600 underline underline-offset-2 hover:text-cocoa-900">
            Read our Privacy Policy
          </a>
        </section>
      )}
    </>
  );
}

function GoogleTag({ onReady }: { onReady: () => void }) {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!measurementId) return null;

  return (
    <Script
      id="examgrind-google-tag"
      src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      strategy="afterInteractive"
      onReady={() => {
        window.gtag?.("js", new Date());
        window.gtag?.("config", measurementId, { anonymize_ip: true });
        window.gtag?.("config", GOOGLE_ADS_ID);
        window.__examgrindGoogleAnalyticsReady = true;
        onReady();
      }}
    />
  );
}

/** Emits one anonymous auth event after consent and GA are both ready. */
function AuthLifecycleEvent() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authEvent = params.get("auth_event");
    if (authEvent !== "sign_up" && authEvent !== "login") return;

    // A refresh before history is cleaned up must not inflate the event.
    const eventKey = `examgrind:auth-event:${authEvent}:${window.location.pathname}`;
    if (window.sessionStorage.getItem(eventKey)) return;

    const sent = authEvent === "sign_up" ? trackSignUp() : trackLogin();
    if (!sent) return;

    if (authEvent === "sign_up") {
      try {
        const raw = window.sessionStorage.getItem("examgrind:diagnosis-signup-intent");
        const intent = raw ? JSON.parse(raw) as { exam?: unknown; createdAt?: unknown } : null;
        const diagnosisExam = intent?.exam;
        const diagnosisIntentCreatedAt = intent?.createdAt;
        const isFreshDiagnosisIntent =
          (diagnosisExam === "cuet" || diagnosisExam === "ssc-cgl" || diagnosisExam === "neet-ug") &&
          typeof diagnosisIntentCreatedAt === "number" &&
          Date.now() - diagnosisIntentCreatedAt < 30 * 60_000;
        if (isFreshDiagnosisIntent) {
          trackDiagnosisSignupCompleted({ exam: diagnosisExam });
        }
        window.sessionStorage.removeItem("examgrind:diagnosis-signup-intent");
      } catch {
        window.sessionStorage.removeItem("examgrind:diagnosis-signup-intent");
      }
      trackSignUpConversion();
    }

    window.sessionStorage.setItem(eventKey, "1");
    params.delete("auth_event");
    const query = params.toString();
    window.history.replaceState(
      window.history.state,
      "",
      `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`,
    );
  }, []);

  return null;
}
