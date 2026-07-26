## Current Implementation

**SDK:** GA4 `gtag.js` loaded with Next.js `Script`; Google Ads and Meta conversion helpers  
**Captured:** 2026-07-26

### Initialization

`components/MarketingTracking.tsx` initializes consent defaults, then loads GA4 from `NEXT_PUBLIC_GA_MEASUREMENT_ID` after the visitor grants consent.

### Client vs Server

Product events are browser-side. Razorpay verification remains server-side; only the already-verified client success flow sends advertising conversion events.

### Call Routing

`lib/product-analytics.ts` is the central typed event boundary. It calls `window.gtag("event", name, params)` only after consent.

### Identity Management

No GA4 user ID, traits, or groups are sent. This protects student privacy and keeps analytics anonymous.

### Environment Variables

`NEXT_PUBLIC_GA_MEASUREMENT_ID` controls GA4 loading.

### Error Handling

Tracking returns `false` when the browser, consent, or tag is unavailable. It does not block product actions.

### Shutdown / Flush

Not applicable to browser `gtag.js`.
