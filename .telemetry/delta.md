# Delta: Current → Target

## Add

| Event | Why | Implementation |
|---|---|---|
| `daily_mission_completed` | Measures whether the recommended dashboard action becomes a meaningful study session. | Store an anonymous short-lived mission context on the CTA; emit only after a non-empty quiz completes. |

## Keep

Keep the existing centralized, consent-gated GA4 wrapper and existing snake_case naming so current GA4 reporting remains continuous.

## Privacy and cost guardrails

- No student PII, quiz answers, question text, payment IDs, or raw topic labels in the new event.
- Do not send a completion event for an all-skipped quiz.
- A session context expires after 30 minutes and is consumed once.
