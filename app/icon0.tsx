import { ImageResponse } from "next/og";

/**
 * 512×512 large PWA icon — required by the manifest spec for high-DPI
 * Android home screens and the Play Store listing. Same design as the
 * 192×192 in app/icon.tsx, just scaled up so it stays sharp.
 */

export const size = { width: 512, height: 512 };
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
          padding: 48,
        }}
      >
        <span
          style={{
            fontSize: 320,
            letterSpacing: -16,
            lineHeight: 1,
            textShadow: "0 16px 40px rgba(0,0,0,0.18)",
          }}
        >
          Eg
        </span>
      </div>
    ),
    size
  );
}
