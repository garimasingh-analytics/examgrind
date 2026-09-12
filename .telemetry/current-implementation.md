## Current Implementation

**SDK:** Google tag / GA4 `gtag.js`, direct Google Ads conversion events, and Meta Pixel helper functions.
**Captured:** 2026-09-06

### Initialization

`app/layout.tsx` creates `window.dataLayer`, a lightweight `window.gtag` queue, and a consent default during HTML parsing. `components/MarketingTracking.tsx` conditionally loads `https://www.googletagmanager.com/gtag/js?id=${NEXT_PUBLIC_GA_MEASUREMENT_ID}` after a visitor grants marketing consent. Its ready callback configures the GA measurement ID and the configured Google Ads ID.

### Client vs Server

Product, Google Ads and Meta tracking calls are browser-side. `lib/product-analytics.ts` calls `window.gtag("event", ...)`. The application does not contain server-side GA4 Measurement Protocol calls.

### Call Routing

Product event names are centralized in `lib/product-analytics.ts` and are called from feature components. Google Ads conversion events are centralized in `lib/google-ads.ts`, with `sign_up` and verified Razorpay purchase flows using separate destinations. Meta helpers are in `lib/meta-ads.ts`.

### Identity Management

No GA4 identify or group calls were found. `components/MarketingTracking.tsx` reads `auth_event` from the URL and sends anonymous `sign_up` or `login` events after consent. It also sends `diagnosis_signup_completed` if a fresh diagnosis-signup intent exists in session storage.

### Environment Variables

- `NEXT_PUBLIC_GA_MEASUREMENT_ID` controls whether the GA tag is rendered.
- Google Ads conversion destination IDs are hard-coded in `lib/google-ads.ts`.
- The Google Ads account ID is configured in `components/MarketingTracking.tsx`.

### Error Handling

Product analytics calls are non-blocking. They return without sending if `window` is unavailable, marketing consent is not granted, or `window.gtag` is unavailable. Google Ads helpers create a `dataLayer` queue fallback when `gtag` is not available.

### Shutdown / Flush

No explicit shutdown or flush handling was found; browser tag delivery is delegated to the Google tag runtime.
