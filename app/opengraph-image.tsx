import { ImageResponse } from "next/og";

/**
 * Root Open Graph image — what WhatsApp / Twitter / LinkedIn show when
 * someone shares the landing page link.
 *
 * Same warm cream + sun gradient palette as the in-app share card so
 * the brand reads consistently across surfaces. Big serif headline +
 * the three exam names as pills so a thumbnail-sized preview still
 * communicates "this app is for CUET / SSC / NEET aspirants."
 */
export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "ExamGrind — AI-graded practice for CUET, SSC CGL & NEET UG";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "radial-gradient(circle at 18% 22%, rgba(253,212,63,0.32) 0%, transparent 55%), radial-gradient(circle at 82% 78%, rgba(253,124,41,0.22) 0%, transparent 55%), #FFF8E8",
          padding: 72,
          fontFamily: "system-ui, sans-serif",
          justifyContent: "space-between",
        }}
      >
        {/* Brand bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              fontFamily: "serif",
              fontSize: 44,
              fontWeight: 800,
              color: "#1F1A14",
              letterSpacing: -1,
            }}
          >
            ExamGrind
          </div>
          <div
            style={{
              fontSize: 22,
              color: "#5C4C3F",
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            AI-graded practice
          </div>
        </div>

        {/* Hero copy */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontFamily: "serif",
              fontSize: 92,
              fontWeight: 700,
              color: "#1F1A14",
              lineHeight: 1.05,
              letterSpacing: -2,
              maxWidth: 980,
            }}
          >
            Know exactly what to study next.
          </div>
          <div
            style={{
              fontSize: 30,
              color: "#3D332A",
              lineHeight: 1.35,
              maxWidth: 900,
            }}
          >
            Concept-level diagnosis on every wrong answer. ₹75/month. No credit
            card.
          </div>
        </div>

        {/* Exam pills */}
        <div style={{ display: "flex", gap: 16 }}>
          {["CUET UG", "SSC CGL", "NEET UG"].map((name) => (
            <div
              key={name}
              style={{
                display: "flex",
                alignItems: "center",
                background: "#1F1A14",
                color: "#FFF8E8",
                padding: "12px 24px",
                borderRadius: 999,
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: 0.5,
              }}
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
