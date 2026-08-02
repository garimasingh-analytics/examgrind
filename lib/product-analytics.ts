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
  DAILY_MISSION_STARTED: "daily_mission_started",
  DAILY_MISSION_COMPLETED: "daily_mission_completed",
  MISTAKE_BOOK_VIEWED: "mistake_book_viewed",
  MISTAKE_TOPIC_RETRY_STARTED: "mistake_topic_retry_started",
  QUIZ_STARTED: "quiz_started",
  QUIZ_COMPLETED: "quiz_completed",
  MOCK_STARTED: "mock_started",
  MOCK_COMPLETED: "mock_completed",
  DEEP_ANALYSIS_REQUESTED: "deep_analysis_requested",
  DEEP_ANALYSIS_COMPLETED: "deep_analysis_completed",
  DEEP_ANALYSIS_VIEWED: "deep_analysis_viewed",
  SUBSCRIPTION_CHECKOUT_STARTED: "subscription_checkout_started",
  SUBSCRIPTION_PURCHASED: "subscription_purchased",
  PAYWALL_VIEWED: "paywall_viewed",
  ACCESS_OPTION_SELECTED: "access_option_selected",
  CHECKOUT_OPENED: "checkout_opened",
  CHECKOUT_DISMISSED: "checkout_dismissed",
  PURCHASE_COMPLETED: "purchase_completed",
  STUDY_PLAN_SAVED: "study_plan_saved",
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
export const trackDailyMissionStarted = (params: {
  mission_type: "foundation" | "repair" | "revision" | "advance";
}) => track(ANALYTICS_EVENTS.DAILY_MISSION_STARTED, params);
export const trackDailyMissionCompleted = (params: {
  mission_type: "foundation" | "repair" | "revision" | "advance";
  question_count: number;
  correct_count: number;
}) => track(ANALYTICS_EVENTS.DAILY_MISSION_COMPLETED, params);
export const trackMistakeBookViewed = (params: { mistake_count: number }) =>
  track(ANALYTICS_EVENTS.MISTAKE_BOOK_VIEWED, params);
export const trackMistakeTopicRetryStarted = () =>
  track(ANALYTICS_EVENTS.MISTAKE_TOPIC_RETRY_STARTED, {});
export const trackQuizStarted = (params: { quiz_id: string; topic: string; question_count: number }) =>
  track(ANALYTICS_EVENTS.QUIZ_STARTED, params);
export const trackQuizCompleted = (params: {
  quiz_id: string;
  question_count: number;
  answered_count: number;
  correct_count: number;
  wrong_count: number;
  skipped_count: number;
  duration_seconds: number;
}) =>
  track(ANALYTICS_EVENTS.QUIZ_COMPLETED, params);
export const trackMockStarted = (params: { mock_test_id: string }) =>
  track(ANALYTICS_EVENTS.MOCK_STARTED, params);
export const trackMockCompleted = (params: {
  correct_count: number;
  wrong_count: number;
  unattempted_count: number;
  duration_seconds: number;
}) => track(ANALYTICS_EVENTS.MOCK_COMPLETED, params);
export const trackDeepAnalysisRequested = (params: { analysis_kind: "regular" | "deep_dive"; source: "quiz" | "mock" }) =>
  track(ANALYTICS_EVENTS.DEEP_ANALYSIS_REQUESTED, params);
export const trackDeepAnalysisCompleted = (params: { analysis_kind: "regular" | "deep_dive"; source: "quiz" | "mock" }) =>
  track(ANALYTICS_EVENTS.DEEP_ANALYSIS_COMPLETED, params);
export const trackDeepAnalysisViewed = (params: { analysis_kind: "regular" | "deep_dive"; source: "quiz" | "mock" }) =>
  track(ANALYTICS_EVENTS.DEEP_ANALYSIS_VIEWED, params);
export const trackSubscriptionCheckoutStarted = (params: { paywall_reason: string }) =>
  track(ANALYTICS_EVENTS.SUBSCRIPTION_CHECKOUT_STARTED, params);
export const trackSubscriptionPurchased = () =>
  track(ANALYTICS_EVENTS.SUBSCRIPTION_PURCHASED, { plan: "monthly_199" });
export type AccessProduct = "analysis_credit" | "score_boost_21d" | "quiz_pack_3" | "quiz_pack_10" | "quiz_pack_15" | "coach_monthly";
export const trackPaywallViewed = (params: { paywall_reason: string }) => track(ANALYTICS_EVENTS.PAYWALL_VIEWED, params);
export const trackAccessOptionSelected = (params: { product: AccessProduct; paywall_reason: string }) => track(ANALYTICS_EVENTS.ACCESS_OPTION_SELECTED, params);
export const trackCheckoutOpened = (params: { product: AccessProduct; checkout_type: "one_time" | "subscription" }) => track(ANALYTICS_EVENTS.CHECKOUT_OPENED, params);
export const trackCheckoutDismissed = (params: { product: AccessProduct; checkout_type: "one_time" | "subscription" }) => track(ANALYTICS_EVENTS.CHECKOUT_DISMISSED, params);
export const trackPurchaseCompleted = (params: { product: AccessProduct; checkout_type: "one_time" | "subscription" }) => track(ANALYTICS_EVENTS.PURCHASE_COMPLETED, params);
export const trackStudyPlanSaved = (params: { exam: string; subject_count: number; daily_minutes: number }) =>
  track(ANALYTICS_EVENTS.STUDY_PLAN_SAVED, params);
