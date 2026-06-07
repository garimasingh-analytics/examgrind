import type { MetadataRoute } from "next";

/**
 * Web App Manifest — what makes ExamGrind installable on a phone home
 * screen and what gives the browser "Add to Home Screen" prompt.
 *
 * Icons live as static PNGs in /public so Android's launcher gets a
 * real raster image (the old dynamic app/icon.tsx returned a placeholder
 * "Eg" monogram; we replaced it 2026-06 with the actual chick stamp
 * matching the in-app mascot). The same artwork ships as the Instagram
 * DP so the brand is unified across surfaces.
 */

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ExamGrind — AI-graded practice for CUET, SSC CGL & NEET UG",
    short_name: "ExamGrind",
    description:
      "Know exactly what to study next. Concept-level diagnosis on every wrong answer. ₹199/month.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#FFF8E8", // cream — matches the loading splash
    theme_color: "#FD7C29", // ember — matches the brand accent
    categories: ["education", "productivity"],
    lang: "en-IN",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      // Maskable variants tell Android it's safe to crop into the
      // launcher's adaptive shape (circle / squircle / rounded square).
      // Our stamp is already a perfect circle so masking is a no-op
      // visually — but flagging it correct prevents Android from
      // adding a default white border.
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
