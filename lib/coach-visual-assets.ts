export type CoachVisualAsset = {
  id: string;
  src: string;
  alt: string;
  title: string;
  sourceLabel: string;
  sourceUrl: string;
  licenceLabel: string;
  licenceUrl: string;
  attribution: string;
  matches: string[];
};

// Only assets whose original source and reuse conditions have been checked belong
// here. Never infer that an image can be reused because it appeared in a search.
export const HEART_VISUAL_ASSET: CoachVisualAsset = {
    id: "human-heart-anatomy",
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/Heart_diagram-en.svg?width=1200",
    alt: "A labelled anatomical diagram of the human heart, including its chambers, major blood vessels, and valves.",
    title: "Anatomy of the human heart",
    sourceLabel: "Wikimedia Commons · Heart diagram",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Heart_diagram-en.svg",
    licenceLabel: "CC BY-SA 3.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    attribution: "ZooFari · CC BY-SA 3.0",
    matches: ["anatomy of heart", "anatomy of the heart", "human heart", "heart anatomy", "heart chambers", "blood circulation"],
  };

export const COACH_VISUAL_ASSETS: CoachVisualAsset[] = [
  HEART_VISUAL_ASSET,
  {
    id: "dna-replication",
    src: "/coach-assets/dna-replication.svg",
    alt: "Diagram of a DNA replication fork, showing the separated DNA strands and replication machinery.",
    title: "DNA replication at the fork",
    sourceLabel: "Wikimedia Commons · Eukaryotic DNA replication",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Eukaryotic_DNA_replication.svg",
    licenceLabel: "CC0 1.0",
    licenceUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    attribution: "LadyofHats · CC0 1.0",
    matches: ["dna replication", "replication", "dna synthesis", "replication fork"],
  },
  {
    id: "sigma-bond",
    src: "/coach-assets/sigma-bond.svg",
    alt: "Diagram of a sigma bond showing head-on overlap and electron density between two atoms.",
    title: "How a sigma bond forms",
    sourceLabel: "Wikimedia Commons · Sigma bond",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Sigma_bond.svg",
    licenceLabel: "CC BY-SA 3.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    attribution: "ZooFari / Anselm H. C. Horn · CC BY-SA 3.0",
    matches: ["sigma bond", "sigma", "chemical bonding", "covalent bond", "orbital overlap"],
  },
  {
    id: "taxonomic-ranks",
    src: "/coach-assets/taxonomic-rank-graph.svg",
    alt: "Hierarchy diagram of taxonomic ranks from domain through species.",
    title: "Taxonomic ranks, from broad to specific",
    sourceLabel: "Wikimedia Commons · Taxonomic Rank Graph",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Taxonomic_Rank_Graph.svg",
    licenceLabel: "CC BY-SA 4.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    attribution: "Annina Breen and contributors · CC BY-SA 4.0",
    matches: ["taxonomy", "systematics", "taxonomic", "taxonomic ranks", "biological classification", "diversity in living world"],
  },
];

function normalise(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function findCoachVisualAsset(...values: Array<string | null | undefined>) {
  const haystack = normalise(values.filter(Boolean).join(" "));
  if (!haystack) return undefined;
  return COACH_VISUAL_ASSETS.find((asset) => asset.matches.some((match) => haystack.includes(normalise(match))));
}
