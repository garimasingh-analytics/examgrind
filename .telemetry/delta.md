# Delta: Study Hub instrumentation (v1.3.0)

## Add

| Event | Why | Implementation |
|---|---|---|
| `study_hub_viewed` | Measures whether students use the public trust/learning hub. | Client tracking component on `/guides` and `/updates`, with surface and selected exam scope. |
| `study_guide_viewed` | Measures which guide topics earn sustained interest. | Client tracking component on each `/guides/[slug]` page, with its known exam and guide slug. |

## Keep

Extend `diagnosis_handoff_action.action` with `read_guide` so the diagnosis-to-guide branch remains part of the same activation flow.

Keep the existing centralized, consent-gated GA4 wrapper and existing snake_case naming so current GA4 reporting remains continuous.

## Privacy and cost guardrails

- No student PII, quiz answers, question text, payment IDs, or raw topic labels in the new event.
- Do not send a completion event for an all-skipped quiz.
- A session context expires after 30 minutes and is consumed once.
- Study Hub events contain only bounded exam labels and public guide slugs; no identity, typed searches, quiz answers, or question text are sent.
