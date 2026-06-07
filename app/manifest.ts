import type { MetadataRoute } from "next";

/**
 * Web App Manifest — what makes ExamGrind installable on a phone home
 * screen and what gives the browser "Add to Home Screen" prompt.
 *
 * Next.js compiles this into /manifest.webmanifest at build time, and
 * the auto-generated `app/icon.tsx` / `app/icon0.tsx` files are picked
 * up automatically — we don't need to enumerate them here.
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
        src: "/icon",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon0",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      // Maskable variants tell Android it's safe to crop into the
      // launcher's adaptive shape (circle / squircle / rounded square).
      {
        src: "/icon",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon0",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
