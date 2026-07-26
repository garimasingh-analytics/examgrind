"use client";

/**
 * Small, typed GA4 event boundary. Events are intentionally anonymous: no
 * email, name, answer text, question text, or payment identifiers are sent.
 * Calls before consent are discarded. Calls made after consent but just before
 * Google finishes loading are safely queued by the Google tag bootstrap.
 */
export const ANALYTICS_EVENTS = {
  SIGN_UP: "sign_up",
  LOGIN: "login",
  QUIZ_STARTED: "quiz_started",
  QUIZ_COMPLETED: "quiz_completed",
  MOCK_STARTED: "mock_started",
  DEEP_ANALYSIS_REQUESTED: "deep_analysis_requested",
  DEEP_ANALYSIS_COMPLETED: "deep_analysis_completed",
  SUBSCRIPTION_CHECKOUT_STARTED: "subscription_checkout_started",
  SUBSCRIPTION_PURCHASED: "subscription_purchased",
} as const;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

type EventName = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];
type EventParams = Record<string, string | number | boolean | undefined>;

function track(name: EventName, params: EventParams) {
  // MarketingTracking installs a lightweight consent default before the
  // Google tag itself loads. An event that occurred before consent must not
  // be sent later if consent is granted; after consent, using the bootstrap
  // queue avoids losing a click made during the short script-load window.
  if (
    typeof window === "undefined" ||
    window.__examgrindMarketingConsent !== "granted" ||
    !window.gtag
  ) {
    return false;
  }
  window.gtag("event", name, params);
  return true;
}

export const trackSignUp = () =>
  track(ANALYTICS_EVENTS.SIGN_UP, { method: "google" });
export const trackLogin = () =>
  track(ANALYTICS_EVENTS.LOGIN, { method: "google" });
export const trackQuizStarted = (params: { quiz_id: string; topic: string; question_count: number }) =>
  track(ANALYTICS_EVENTS.QUIZ_STARTED, params);
export const trackQuizCompleted = (params: { quiz_id: string; question_count: number; answered_count: number; duration_seconds: number }) =>
  track(ANALYTICS_EVENTS.QUIZ_COMPLETED, params);
export const trackMockStarted = (params: { mock_test_id: string }) =>
  track(ANALYTICS_EVENTS.MOCK_STARTED, params);
export const trackDeepAnalysisRequested = (params: { analysis_kind: "regular" | "deep_dive"; source: "quiz" | "mock" }) =>
  track(ANALYTICS_EVENTS.DEEP_ANALYSIS_REQUESTED, params);
export const trackDeepAnalysisCompleted = (params: { analysis_kind: "regular" | "deep_dive"; source: "quiz" | "mock" }) =>
  track(ANALYTICS_EVENTS.DEEP_ANALYSIS_COMPLETED, params);
export const trackSubscriptionCheckoutStarted = (params: { paywall_reason: string }) =>
  track(ANALYTICS_EVENTS.SUBSCRIPTION_CHECKOUT_STARTED, params);
export const trackSubscriptionPurchased = () =>
  track(ANALYTICS_EVENTS.SUBSCRIPTION_PURCHASED, { plan: "monthly_199" });
