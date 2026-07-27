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
  quiz_pack_3: { pricePaise: 4900, label: "3 Quiz Pack", description: "Three quiz starts, valid for one year" },
  quiz_pack_10: { pricePaise: 14900, label: "10 Quiz Pack", description: "Ten quiz starts, valid for one year" },
  quiz_pack_15: { pricePaise: 19900, label: "15 Quiz Pack", description: "Fifteen quiz starts, valid for one year" },
} as const;

export type OneTimeProduct = keyof typeof ONE_TIME_PRODUCTS;

export function isOneTimeProduct(value: unknown): value is OneTimeProduct {
  return typeof value === "string" && value in ONE_TIME_PRODUCTS;
}
