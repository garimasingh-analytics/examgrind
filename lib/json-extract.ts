/**
 * Tolerant JSON extractor for LLM output.
 *
 * Anthropic models sometimes return JSON with:
 *   1. Prose preamble/postamble ("Here is your analysis:\n{...}\nHope this helps!")
 *   2. Markdown code fences (```json ... ```)
 *   3. Unterminated strings at the end (max_tokens hit mid-string) — 2026-07-18 incident
 *   4. Trailing commas (invalid JSON but human-writable)
 *
 * `extractJSON` returns the parsed object, or throws with a message describing what it tried.
 * On the "unterminated string / brackets" case it best-effort closes them so we still return
 * SOMETHING to the user, which is way better than a hard 502.
 *
 * All salvage attempts are logged so we can see WHICH failure mode fired in prod.
 */

export type ExtractResult<T> =
  | { ok: true; value: T; strategy: "clean" | "fenced" | "brace-slice" | "salvaged-truncation" }
  | { ok: false; error: string; snippet: string };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractJSON<T = any>(raw: string): ExtractResult<T> {
  if (!raw || typeof raw !== "string") {
    return { ok: false, error: "empty response", snippet: "" };
  }

  // Strategy 1 — clean. Trim + parse.
  const trimmed = raw.trim();
  try {
    return { ok: true, value: JSON.parse(trimmed) as T, strategy: "clean" };
  } catch {
    // fall through
  }

  // Strategy 2 — strip markdown code fences ("```json ... ```" or "``` ... ```").
  const fenced = trimmed
    .replace(/^```(?:json|JSON)?\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim();
  if (fenced !== trimmed) {
    try {
      return { ok: true, value: JSON.parse(fenced) as T, strategy: "fenced" };
    } catch {
      // fall through
    }
  }

  // Strategy 3 — slice from first "{" to last "}" (or "[" ... "]") to drop prose.
  const source = fenced;
  const firstBrace = source.indexOf("{");
  const firstBracket = source.indexOf("[");
  const start =
    firstBrace === -1
      ? firstBracket
      : firstBracket === -1
      ? firstBrace
      : Math.min(firstBrace, firstBracket);

  if (start === -1) {
    return {
      ok: false,
      error: "no { or [ found",
      snippet: source.slice(0, 200),
    };
  }

  const opener = source[start];
  const closer = opener === "{" ? "}" : "]";
  const end = source.lastIndexOf(closer);

  if (end > start) {
    const sliced = source.slice(start, end + 1);
    try {
      return { ok: true, value: JSON.parse(sliced) as T, strategy: "brace-slice" };
    } catch {
      // fall through — probably an unterminated string INSIDE the sliced range
    }
  }

  // Strategy 4 — salvage truncated JSON.
  // Take everything from the first "{" onwards, then try to close it:
  //   1. If we're inside an open string, close it (append `"`).
  //   2. Close every unclosed { and [ in reverse.
  // This is best-effort. It will produce valid JSON that may be missing content
  // near the end of the truncated response, but at least the user gets a partial
  // analysis instead of a 502.
  const salvaged = salvageTruncatedJSON(source.slice(start));
  if (salvaged !== null) {
    try {
      return {
        ok: true,
        value: JSON.parse(salvaged) as T,
        strategy: "salvaged-truncation",
      };
    } catch (e) {
      return {
        ok: false,
        error: `salvage attempted but still invalid: ${(e as Error).message}`,
        snippet: salvaged.slice(-300),
      };
    }
  }

  return {
    ok: false,
    error: "all extraction strategies failed",
    snippet: source.slice(-300),
  };
}

/**
 * Best-effort close of a truncated JSON string.
 * Walks the string tracking string-open/close state and { / [ nesting.
 * At the end: if we're inside an unterminated string, append `"`.
 * Then append every unclosed } and ] in reverse order.
 * Also strips a trailing comma or unterminated key like `"foo": ` at the very end
 * (common truncation site: max_tokens hit right after a comma or colon).
 */
function salvageTruncatedJSON(input: string): string | null {
  let inString = false;
  let escape = false;
  const stack: string[] = [];

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (ch === "\\") {
      escape = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      continue;
    }
    if (inString) continue;

    if (ch === "{" || ch === "[") stack.push(ch);
    else if (ch === "}") {
      if (stack[stack.length - 1] === "{") stack.pop();
    } else if (ch === "]") {
      if (stack[stack.length - 1] === "[") stack.pop();
    }
  }

  if (stack.length === 0 && !inString) {
    // Not actually truncated — nothing to salvage, and the earlier parse
    // attempts should have worked.
    return null;
  }

  let repaired = input;

  // If we're mid-string, close the string.
  if (inString) repaired += '"';

  // Strip a dangling ", " or "," at the end of the last object — that means
  // the last property was cut off mid-key or before value. Remove it so the
  // closing brace we add isn't after a stray comma.
  repaired = repaired.replace(/[,\s]*$/, "");

  // Also strip a dangling `"key":` that has no value yet (max_tokens hit
  // right after the colon). Regex here is intentionally simple — we're doing
  // damage control, not perfect parsing.
  repaired = repaired.replace(/,\s*"[^"]*"\s*:\s*$/, "");
  repaired = repaired.replace(/{\s*"[^"]*"\s*:\s*$/, "{");
  repaired = repaired.replace(/\[\s*"[^"]*"\s*:\s*$/, "[");

  // Close unclosed brackets in reverse.
  while (stack.length > 0) {
    const opener = stack.pop();
    repaired += opener === "{" ? "}" : "]";
  }

  return repaired;
}
