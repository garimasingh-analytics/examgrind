# Product: ExamGrind

**Last updated:** 2026-07-26  
**Method:** codebase scan + established product strategy

## Product Identity

- **One-liner:** Indian competitive-exam aspirants complete AI-generated practice, see where they went wrong, and receive the next study action for their chosen exam.
- **Category:** AI learning product
- **Product type:** B2C, single-player
- **Collaboration:** single-player

## Business Model

- **Monetization:** freemium subscription
- **Pricing:** three quizzes and one analysis free; ExamGrind Coach ₹199/month
- **Billing:** Razorpay subscriptions

## Tech Stack

- **Primary language:** TypeScript
- **Framework:** Next.js 14
- **Database and auth:** Supabase Postgres and Auth
- **AI:** Anthropic
- **Analytics destinations:** GA4, Google Ads conversion tag, Meta Pixel

## Value Mapping

### Primary Value Action

**Completing a targeted quiz and receiving a useful next action** — if this stops, ExamGrind is not helping a student improve.

### Core Features

1. AI-generated topic quizzes and mocks.
2. Results, mistake review, readiness, and daily mission.
3. AI Deep Analysis and subscriptions.

### Supporting Features

1. Authentication, selected exam, consent, and payment flows.
2. Streaks, milestones, weekly/monthly proof, and feedback.

## Entity Model

### Users

- **ID format:** Supabase UUID
- **Roles:** student; admin access is server-side
- **Multi-account:** no

## Group Hierarchy

No group hierarchy. ExamGrind is B2C and tracking is user/session-level only.

## Current State

- **Existing tracking:** consent-gated GA4 browser events; Google Ads and Meta purchase conversion calls.
- **Documentation:** created in this folder.
- **Known constraint:** no user identity or PII is sent to GA4.
