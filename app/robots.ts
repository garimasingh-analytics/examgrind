import type { MetadataRoute } from "next";

/**
 * /robots.txt — tells crawlers what to index.
 *
 * Public: landing, partners, legal pages.
 * Private: /admin, /api, /auth, anything user-state-specific.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://examgrind.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/api/",
          "/auth/",
          "/home", // user dashboard
          "/me",
          "/subject/",
          "/chapter/",
          "/topic/",
          "/quiz/",
          "/results/",
          "/start/", // exam picker — needs auth
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
