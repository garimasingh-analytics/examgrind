/**
 * Best-effort alert webhook for ops-relevant events.
 *
 * Fires a POST to ALERT_WEBHOOK_URL if configured. Falls back to
 * console.error with an [ALERT] prefix so Vercel logs still show
 * the event even without a webhook.
 *
 * Works with Slack incoming webhooks, Discord webhooks, or any
 * endpoint that accepts JSON `{ text: "..." }`.
 *
 * Never throws, never blocks the user response for more than 2s.
 * Use this everywhere we want to know about something in real time —
 * Anthropic credit failures, new partner applications, etc.
 */
export async function fireAlert(
  message: string,
  context: Record<string, unknown> = {}
): Promise<void> {
  const url = process.env.ALERT_WEBHOOK_URL;
  if (!url) {
    console.error("[ALERT]", message, JSON.stringify(context));
    return;
  }
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `🚨 ExamGrind: ${message}`,
        ...context,
      }),
      signal: AbortSignal.timeout(2000),
    });
  } catch (e) {
    console.error("[ALERT] webhook failed:", e);
  }
}
