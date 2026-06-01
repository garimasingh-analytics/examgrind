import Anthropic from "@anthropic-ai/sdk";

/**
 * Resilient wrapper around Anthropic message generation.
 *
 * Handles the three things that can ruin a student's quiz mid-flow:
 *   1) Transient failures (model overload, 5xx, rate limits) — we retry
 *      with exponential backoff so a brief hiccup at Anthropic doesn't
 *      bubble up as a "Couldn't generate questions" toast.
 *   2) Credit balance too low — fires the alert webhook (if configured)
 *      so the founder knows auto-reload failed, and returns a friendly
 *      "we're topping up, try again in a minute" error to the student.
 *   3) Permanent errors (bad API key, invalid request) — no retry, log
 *      loudly, return a clear error code.
 *
 * Why retries are safe: we use this only for question/analysis
 * generation where the request is idempotent (same prompt → fine to
 * re-run; we're not charging or sending external mail in here).
 */

type ClassifiedError =
  | { kind: "credit_balance" }
  | { kind: "rate_limit" }
  | { kind: "overloaded" }
  | { kind: "transient_5xx" }
  | { kind: "auth" }
  | { kind: "invalid_request" }
  | { kind: "unknown" };

function classifyError(err: unknown): ClassifiedError {
  if (err instanceof Anthropic.APIError) {
    const status = err.status;
    // Anthropic sets a structured error.type — credit_balance_too_low
    // is what we get when the prepaid balance is exhausted before
    // auto-reload kicks in.
    type ErrorBody = { error?: { type?: string } };
    const errType =
      (err as Anthropic.APIError & { error?: ErrorBody["error"] })?.error
        ?.type ?? "";
    if (errType.includes("credit_balance")) return { kind: "credit_balance" };
    if (status === 429) return { kind: "rate_limit" };
    if (status === 529) return { kind: "overloaded" };
    if (status === 401 || status === 403) return { kind: "auth" };
    if (status === 400) return { kind: "invalid_request" };
    if (status && status >= 500) return { kind: "transient_5xx" };
  }
  return { kind: "unknown" };
}

function isRetryable(err: ClassifiedError): boolean {
  return (
    err.kind === "rate_limit" ||
    err.kind === "overloaded" ||
    err.kind === "transient_5xx"
  );
}

/**
 * Fires the ops alert webhook (if configured). Best-effort — never
 * throws. Use this to ping yourself when something needs human
 * attention (credit balance hit zero, repeated 5xx, etc.).
 *
 * Set ALERT_WEBHOOK_URL in env to enable. Works with Slack incoming
 * webhooks, Discord webhooks, or any endpoint that accepts a POST
 * with JSON body `{ text: "..." }`.
 */
async function fireAlert(
  message: string,
  context: Record<string, unknown> = {}
) {
  const url = process.env.ALERT_WEBHOOK_URL;
  if (!url) {
    console.error("[ALERT]", message, context);
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
      // Don't let a slow webhook block the user-facing response.
      signal: AbortSignal.timeout(2000),
    });
  } catch (e) {
    console.error("[ALERT] webhook failed:", e);
  }
}

export type ResilientResult =
  | { ok: true; text: string }
  | {
      ok: false;
      userMessage: string;
      httpStatus: number;
      kind: ClassifiedError["kind"];
    };

export async function generateWithRetry(
  anthropic: Anthropic,
  params: Anthropic.MessageCreateParamsNonStreaming
): Promise<ResilientResult> {
  // 3 attempts: 0ms → 500ms → 2000ms. Total worst-case 2.5s extra.
  const delays = [0, 500, 2000];

  let lastErr: unknown;
  for (let i = 0; i < delays.length; i++) {
    if (delays[i] > 0) {
      await new Promise((r) => setTimeout(r, delays[i]));
    }
    try {
      const resp = await anthropic.messages.create(params);
      const text =
        resp.content
          .filter((b) => b.type === "text")
          .map((b) => (b as { type: "text"; text: string }).text)
          .join("")
          .trim();
      return { ok: true, text };
    } catch (err) {
      lastErr = err;
      const classified = classifyError(err);

      // Hard fail on permanent errors — no point retrying.
      if (!isRetryable(classified)) {
        return mapPermanentError(classified, err);
      }
      // Otherwise loop to next attempt.
    }
  }

  // Out of retries — return the last error mapped.
  const classified = classifyError(lastErr);
  return mapPermanentError(classified, lastErr);
}

function mapPermanentError(
  classified: ClassifiedError,
  raw: unknown
): ResilientResult {
  switch (classified.kind) {
    case "credit_balance":
      // ALERT THE FOUNDER. This means auto-reload didn't fire in time
      // and a real student is staring at an error screen.
      void fireAlert(
        "Anthropic credit balance too low — quiz generation blocked",
        {
          severity: "P1",
          action: "Top up at console.anthropic.com/settings/billing",
        }
      );
      console.error("[anthropic] credit_balance_too_low — top up NOW", raw);
      return {
        ok: false,
        kind: "credit_balance",
        httpStatus: 503,
        userMessage:
          "We're recharging our AI quota — please try again in a minute. Sorry for the bump.",
      };
    case "rate_limit":
      console.error("[anthropic] rate_limit after retries", raw);
      return {
        ok: false,
        kind: "rate_limit",
        httpStatus: 429,
        userMessage:
          "We're getting a lot of requests right now — give it a few seconds and try again.",
      };
    case "overloaded":
      console.error("[anthropic] overloaded after retries", raw);
      return {
        ok: false,
        kind: "overloaded",
        httpStatus: 503,
        userMessage:
          "Our AI is briefly overloaded. Try again in a few seconds.",
      };
    case "transient_5xx":
      console.error("[anthropic] 5xx after retries", raw);
      return {
        ok: false,
        kind: "transient_5xx",
        httpStatus: 502,
        userMessage:
          "Our AI hiccuped. Please try again — we kept your progress.",
      };
    case "auth":
      // ALERT THE FOUNDER. The API key is wrong / revoked / expired.
      void fireAlert("Anthropic auth failure — check ANTHROPIC_API_KEY", {
        severity: "P0",
        action: "Rotate / verify ANTHROPIC_API_KEY in Vercel env",
      });
      console.error("[anthropic] auth error — rotate key", raw);
      return {
        ok: false,
        kind: "auth",
        httpStatus: 500,
        userMessage:
          "We're hitting a server issue. Please try again in a minute.",
      };
    case "invalid_request":
      console.error("[anthropic] invalid request", raw);
      return {
        ok: false,
        kind: "invalid_request",
        httpStatus: 500,
        userMessage:
          "We couldn't generate this quiz. Try a different topic.",
      };
    default:
      console.error("[anthropic] unknown error", raw);
      return {
        ok: false,
        kind: "unknown",
        httpStatus: 502,
        userMessage:
          "Couldn't generate questions. Please try again.",
      };
  }
}
