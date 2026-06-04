import { ImageResponse } from "next/og";

/**
 * 192×192 PWA / Android home-screen icon, generated at build time.
 *
 * We don't ship a PNG — Next.js's ImageResponse renders this on demand
 * and caches it, which means design changes are a one-file edit instead
 * of regenerating raster assets.
 *
 * Design: warm sun→ember gradient (the brand's hero band) with a bold
 * cream "Eg" monogram. Reads cleanly at 48px on a phone home screen.
 */

export const size = { width: 192, height: 192 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #FFD43F 0%, #FD7C29 100%)",
          fontFamily: "serif",
          fontWeight: 800,
          color: "#FFF8E8",
          // Slight inset so the monogram doesn't crowd the round mask
          // Android applies for adaptive icons.
          padding: 18,
        }}
      >
        <span
          style={{
            fontSize: 120,
            letterSpacing: -6,
            lineHeight: 1,
            textShadow: "0 6px 16px rgba(0,0,0,0.18)",
          }}
        >
          Eg
        </span>
      </div>
    ),
    size
  );
}
