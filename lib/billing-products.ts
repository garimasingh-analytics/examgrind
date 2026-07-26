export const ONE_TIME_PRODUCTS = {
  analysis_credit: {
    pricePaise: 1900,
    label: "1 AI Analysis",
    description: "One AI Analysis for a completed quiz or mock",
  },
  score_boost_21d: {
    pricePaise: 4900,
    label: "21-Day Score Boost",
    description: "A fixed 21-day study roadmap",
  },
} as const;

export type OneTimeProduct = keyof typeof ONE_TIME_PRODUCTS;

export function isOneTimeProduct(value: unknown): value is OneTimeProduct {
  return typeof value === "string" && value in ONE_TIME_PRODUCTS;
}
