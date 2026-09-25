/**
 * The mock generator is intentionally probabilistic, so question freshness
 * cannot live only in the prompt. These utilities turn a student-visible
 * question stem into stable comparison keys and reject both exact repeats and
 * obvious "same question, different numbers" variants.
 */

export const MOCK_DIFFICULTIES = ["easy", "medium", "hard"] as const;

export type MockDifficulty = (typeof MOCK_DIFFICULTIES)[number];

export function isMockDifficulty(value: unknown): value is MockDifficulty {
  return typeof value === "string" && (MOCK_DIFFICULTIES as readonly string[]).includes(value);
}

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "by",
  "choose",
  "correct",
  "does",
  "do",
  "each",
  "find",
  "following",
  "for",
  "from",
  "how",
  "in",
  "is",
  "of",
  "on",
  "or",
  "select",
  "statement",
  "statements",
  "the",
  "to",
  "value",
  "what",
  "which",
  "with",
]);

export function normalizeMockQuestionStem(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    // Keep non-Latin scripts (notably Hindi) without relying on Unicode
    // property escapes, because this project still targets ES5 in tsconfig.
    .replace(/[^a-z0-9\u0080-\uFFFF]+/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function numberMaskedTemplate(normalized: string): string {
  return normalized.replace(/\d+(?:\s+\d+)*/g, "#");
}

function tokenSignature(normalized: string): string {
  const tokens = contentTokens(normalized);

  if (tokens.length < 3) return "";
  return Array.from(new Set(tokens)).sort().join("|");
}

function contentTokens(normalized: string): string[] {
  return normalized
    .split(" ")
    .map((token) => (/^\d+$/.test(token) ? "#" : token))
    .filter((token) => token === "#" || !STOP_WORDS.has(token));
}

type QuestionIdentity = {
  fingerprint: string;
  numericTemplate: string;
  tokenSignature: string;
  contentTokens: string[];
};

function identify(stem: string): QuestionIdentity | null {
  const fingerprint = normalizeMockQuestionStem(stem);
  if (!fingerprint) return null;
  return {
    fingerprint,
    numericTemplate: numberMaskedTemplate(fingerprint),
    tokenSignature: tokenSignature(fingerprint),
    contentTokens: contentTokens(fingerprint),
  };
}

function isNearTokenDuplicate(candidate: string[], historic: string[]): boolean {
  // Very short stems do not carry enough signal for similarity matching. The
  // exact and numeric-template checks above still protect those safely.
  if (candidate.length < 4 || historic.length < 4) return false;

  const candidateSet = new Set(candidate);
  const historicSet = new Set(historic);
  let shared = 0;
  candidateSet.forEach((token) => {
    if (historicSet.has(token)) shared += 1;
  });

  // If at least 80% of the smaller content-word set is identical, this is a
  // light rewrite of an old question rather than a new way of testing the
  // concept. It catches reordered wording and synonymous framing while still
  // allowing a different problem from the same chapter.
  return shared >= 4 && shared / Math.min(candidateSet.size, historicSet.size) >= 0.8;
}

/**
 * Maintains a per-attempt catalogue of every question a student has already
 * seen. The numeric-template and token-signature checks deliberately reject
 * superficial reskins of a familiar question, while allowing the same topic
 * to appear through a genuinely different problem.
 */
export function createMockQuestionFreshnessGuard(previousStems: Iterable<string>) {
  const exact = new Set<string>();
  const numericTemplates = new Set<string>();
  const tokenSignatures = new Set<string>();
  const contentTokenSets: string[][] = [];
  const promptExamples: string[] = [];

  const add = (stem: string) => {
    const identity = identify(stem);
    if (!identity) return;

    exact.add(identity.fingerprint);
    numericTemplates.add(identity.numericTemplate);
    if (identity.tokenSignature) tokenSignatures.add(identity.tokenSignature);
    if (identity.contentTokens.length >= 4) {
      contentTokenSets.push(identity.contentTokens);
    }

    const compact = stem.replace(/\s+/g, " ").trim();
    if (compact) {
      promptExamples.push(compact.slice(0, 320));
      if (promptExamples.length > 180) promptExamples.shift();
    }
  };

  // History arrives newest-first. Add it oldest-first so the bounded prompt
  // sample retains the most recent stems, then naturally keeps this mock's
  // newly accepted questions too.
  const historicStems = Array.from(previousStems);
  for (let index = historicStems.length - 1; index >= 0; index -= 1) {
    add(historicStems[index]);
  }

  return {
    isFresh(stem: string) {
      const identity = identify(stem);
      if (!identity) return false;
      if (exact.has(identity.fingerprint)) return false;
      if (numericTemplates.has(identity.numericTemplate)) return false;
      if (identity.tokenSignature && tokenSignatures.has(identity.tokenSignature)) return false;
      if (
        identity.contentTokens.length >= 4 &&
        contentTokenSets.some((historic) =>
          isNearTokenDuplicate(identity.contentTokens, historic)
        )
      ) {
        return false;
      }
      return true;
    },
    accept(stem: string) {
      add(stem);
    },
    promptExclusions(limit = 60) {
      return promptExamples.slice(-limit);
    },
  };
}
