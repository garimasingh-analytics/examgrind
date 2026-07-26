"use client";

/**
 * Small, typed GA4 event boundary. Events are intentionally anonymous: no
 * email, name, answer text, question text, or payment identifiers are sent.
 * Calls are safe before consent because gtag is absent until consent is given.
 */
export const ANALYTICS_EVENTS = {
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
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", name, params);
}

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
