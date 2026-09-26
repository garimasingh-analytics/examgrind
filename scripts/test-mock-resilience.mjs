#!/usr/bin/env node
/**
 * Reliability regression test for full mock generation.
 *
 * 1. Proves transport-level failures are retried by the shared Anthropic
 *    wrapper instead of immediately surfacing to the mock route.
 * 2. Makes one tiny live request against the designated backup model, so a
 *    typo, revoked model access, or account-level restriction cannot silently
 *    turn the fallback path into an untested promise.
 *
 * It never creates a Supabase attempt or touches student data.
 */
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
require("@next/env").loadEnvConfig(process.cwd());

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error("ANTHROPIC_API_KEY is required for test:mock-resilience");
}

const Module = require("module");
const originalResolveFilename = Module._resolveFilename;
Module._resolveFilename = function resolveExamGrindAlias(request, parent, isMain, options) {
  if (request.startsWith("@/")) {
    return originalResolveFilename(
      path.join(process.cwd(), request.slice(2)),
      parent,
      isMain,
      options
    );
  }
  return originalResolveFilename(request, parent, isMain, options);
};
require("sucrase/register/ts");

const Anthropic = require("@anthropic-ai/sdk").default;
const { generateWithRetry } = require("../lib/anthropic-resilient.ts");

let simulatedCalls = 0;
let lastRequestOptions;
const simulatedClient = {
  messages: {
    create: async (_params, requestOptions) => {
      lastRequestOptions = requestOptions;
      simulatedCalls += 1;
      if (simulatedCalls < 3) {
        const cause = Object.assign(new Error("connection reset"), {
          code: "ECONNRESET",
        });
        throw new Anthropic.APIConnectionError({ cause });
      }
      return { content: [{ type: "text", text: "[]" }] };
    },
  },
};

const simulatedResult = await generateWithRetry(simulatedClient, {
  model: "test-model",
  max_tokens: 16,
  messages: [{ role: "user", content: "test" }],
}, {
  retryDelays: [0, 0, 0],
  requestTimeoutMs: 1234,
});
assert.equal(simulatedResult.ok, true, "connection errors must be retried");
assert.equal(simulatedCalls, 3, "the wrapper must continue after transport failures");
assert.equal(lastRequestOptions?.maxRetries, 0, "the SDK must not add hidden retries to the app retry budget");
assert.equal(lastRequestOptions?.timeout, 1234, "latency-sensitive callers must be able to cap one provider request");

const backup = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const backupResult = await generateWithRetry(backup, {
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 24,
  messages: [{ role: "user", content: "Reply with only the word READY." }],
});
assert.equal(backupResult.ok, true, "backup model must be reachable");
assert.match(
  backupResult.ok ? backupResult.text : "",
  /READY/i,
  "backup model should return its tiny smoke response"
);

console.log(
  "✓ test:mock-resilience passed — transport retries and live backup model are available"
);
