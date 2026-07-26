# GA4 Instrumentation Guide

**Target:** consent-gated GA4 browser `gtag.js` via the existing `lib/product-analytics.ts` wrapper.

## Pattern

GA4 product events use `window.gtag("event", event_name, params)`. The wrapper remains the only delivery boundary, requires granted consent, and must never block a learning flow.

```ts
export const trackDailyMissionCompleted = (params: {
  mission_type: "foundation" | "repair" | "revision" | "advance";
  question_count: number;
  correct_count: number;
}) => track(ANALYTICS_EVENTS.DAILY_MISSION_COMPLETED, params);
```

## Identity and groups

ExamGrind intentionally sends no `user_id`, user traits, or groups to GA4. GA4 has no native B2C group need here, and anonymous student analytics is the privacy-preserving choice.

## Verification

1. Grant cookie consent in a signed-in browser.
2. Start the dashboard mission and complete at least one quiz answer within 30 minutes.
3. Confirm `daily_mission_completed` in GA4 DebugView/Realtime with `mission_type`, `question_count`, and `correct_count`.
4. Confirm an all-skipped quiz does not emit it.
