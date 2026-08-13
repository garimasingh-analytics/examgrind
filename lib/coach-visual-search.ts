import type { CoachVisualAsset } from "@/lib/coach-visual-assets";

type CommonsMetadata = Record<string, { value?: string } | undefined>;
type CommonsImageInfo = {
  thumburl?: string;
  url?: string;
  extmetadata?: CommonsMetadata;
};
type CommonsPage = { title?: string; imageinfo?: CommonsImageInfo[] };

const COMMONS_API = "https://commons.wikimedia.org/w/api.php";
const REUSABLE_LICENCE = /(?:cc\s*(?:by|0)|creative\s+commons|public\s+domain)/i;
const EXCLUDED_LICENCE = /(?:all rights reserved|no derivatives|\bcc[- ]?by[- ]?nd\b)/i;

function plainText(value: string | undefined, limit = 220) {
  return (value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&(?:nbsp|amp|quot|#39);/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, limit);
}

function metadata(metadata: CommonsMetadata | undefined, key: string) {
  return plainText(metadata?.[key]?.value);
}

function candidateScore(query: string, title: string, description: string) {
  const words = query.toLowerCase().match(/[a-z0-9]{3,}/g) ?? [];
  const haystack = `${title} ${description}`.toLowerCase();
  const exact = haystack.includes(query.toLowerCase()) ? 8 : 0;
  return exact + words.filter((word) => haystack.includes(word)).length;
}

/**
 * Finds one educational visual with explicit, machine-readable reuse metadata.
 * We deliberately search Commons—not a general image search—because a link back
 * to an arbitrary search result does not create a licence to display it.
 */
export async function findReusableCommonsVisual(concept: string): Promise<CoachVisualAsset | undefined> {
  const query = concept.trim().slice(0, 120);
  if (query.length < 3) return undefined;

  const params = new URLSearchParams({
    action: "query",
    format: "json",
    generator: "search",
    gsrnamespace: "6",
    gsrlimit: "8",
    gsrsearch: `${query} filetype:bitmap`,
    prop: "imageinfo",
    iiprop: "url|extmetadata",
    iiurlwidth: "1200",
    iiextmetadatafilter: "Artist|Credit|ImageDescription|LicenseShortName|UsageTerms",
    origin: "*",
  });

  try {
    const response = await fetch(`${COMMONS_API}?${params}`, {
      next: { revalidate: 60 * 60 * 24 * 30 },
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) return undefined;
    const data = await response.json() as { query?: { pages?: Record<string, CommonsPage> } };
    const candidates = Object.values(data.query?.pages ?? []).flatMap((page) => {
      const info = page.imageinfo?.[0];
      const title = plainText(page.title, 180);
      const sourceUrl = title ? `https://commons.wikimedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}` : "";
      const licence = metadata(info?.extmetadata, "LicenseShortName") || metadata(info?.extmetadata, "UsageTerms");
      const description = metadata(info?.extmetadata, "ImageDescription");
      const author = metadata(info?.extmetadata, "Artist") || metadata(info?.extmetadata, "Credit") || "Wikimedia Commons contributor";
      const src = info?.thumburl || info?.url;
      if (!title || !sourceUrl || !src || !licence || !REUSABLE_LICENCE.test(licence) || EXCLUDED_LICENCE.test(licence)) return [];
      return [{ title, sourceUrl, licence, description, author, src, score: candidateScore(query, title, description) }];
    }).filter((candidate) => candidate.score >= 1).sort((a, b) => b.score - a.score);

    const visual = candidates[0];
    if (!visual) return undefined;
    const displayTitle = visual.title.replace(/^File:\s*/i, "").replace(/\.[a-z0-9]+$/i, "").replace(/[_-]+/g, " ");
    return {
      id: `commons-${visual.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
      src: visual.src,
      alt: visual.description || `Openly licensed reference visual for ${query}.`,
      title: displayTitle,
      sourceLabel: "Wikimedia Commons",
      sourceUrl: visual.sourceUrl,
      licenceLabel: visual.licence,
      licenceUrl: visual.sourceUrl,
      attribution: visual.author,
    };
  } catch {
    // A visual is an enhancement, never a reason to make a lesson fail.
    return undefined;
  }
}
