import type { MetadataRoute } from "next";
import { studyGuides } from "@/lib/study-guides";

/**
 * /sitemap.xml — what Google indexes.
 *
 * Only public pages. We don't list /admin or any user-state-bearing
 * route (those are blocked in robots.ts).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://examgrind.in";

  // Do not manufacture a new "last modified" date on every crawl. It can
  // make a small site look noisy to search engines and tells crawlers nothing
  // useful about which public pages genuinely changed.
  const siteUpdatedAt = new Date("2026-08-23T00:00:00.000Z");

  return [
    {
      url: `${baseUrl}/`,
      lastModified: siteUpdatedAt,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: siteUpdatedAt,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: siteUpdatedAt,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/refund`,
      lastModified: siteUpdatedAt,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: siteUpdatedAt,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/guides`,
      lastModified: siteUpdatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/updates`,
      lastModified: siteUpdatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...studyGuides.map((guide) => ({
      url: `${baseUrl}/guides/${guide.slug}`,
      // Guide dates are human-readable editorial labels, so retain a stable
      // crawl timestamp here rather than attempting to parse locale text.
      lastModified: siteUpdatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    {
      url: `${baseUrl}/ssc-cgl-2026`,
      lastModified: siteUpdatedAt,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: siteUpdatedAt,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/editorial-standards`,
      lastModified: siteUpdatedAt,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];
}
