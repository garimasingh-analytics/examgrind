import { ImageResponse } from "next/og";

/**
 * 180×180 Apple touch icon — used when iOS Safari users tap "Add to
 * Home Screen". iOS doesn't honour the rounded mask we'd get on Android,
 * so we keep the gradient bleed-to-edge.
 */

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          padding: 16,
        }}
      >
        <span
          style={{
            fontSize: 112,
            letterSpacing: -6,
            lineHeight: 1,
            textShadow: "0 6px 14px rgba(0,0,0,0.18)",
          }}
        >
          Eg
        </span>
      </div>
    ),
    size
  );
}
