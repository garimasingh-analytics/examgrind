import { ImageResponse } from "next/og";
import { createServerSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const alt = "ExamGrind quiz score";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ id: string }> };

/**
 * Dynamically generated Open Graph image — this is what WhatsApp, Twitter,
 * Instagram, etc. show when someone shares a /share/[id] link.
 *
 * Tuned for warm Maxima palette: cream background, sun-yellow accents,
 * big readable score, chick mascot. No external images — everything is
 * SVG so it renders without network round-trips.
 */
export default async function Image({ params }: Props) {
  const { id } = await params;
  const supabase = createServerSupabase();

  const { data: quiz } = await supabase
    .from("quizzes")
    .select("subject, subtopic, score")
    .eq("id", id)
    .maybeSingle();

  const { count } = quiz
    ? await supabase
        .from("questions")
        .select("id", { count: "exact", head: true })
        .eq("quiz_id", id)
    : { count: 0 };

  const score = quiz?.score ?? 0;
  const total = count ?? 0;
  const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;
  const subject = quiz?.subject ?? "ExamGrind";
  const topic = quiz?.subtopic ?? "Practice";

  const chickFace =
    accuracy >= 70 ? "happy" : accuracy >= 40 ? "idle" : "sad";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "radial-gradient(circle at 18% 22%, rgba(253,203,64,0.32) 0%, transparent 55%), radial-gradient(circle at 82% 78%, rgba(253,124,41,0.22) 0%, transparent 55%), #FFF8E8",
          padding: 64,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Top — brand */}
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
              fontSize: 40,
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

        {/* Middle — chick + score */}
        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 30,
          }}
        >
          {/* Score block */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: 700,
            }}
          >
            <div
              style={{
                fontSize: 28,
                color: "#5C4C3F",
                letterSpacing: 3,
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              {subject}
            </div>
            <div
              style={{
                fontFamily: "serif",
                fontSize: 60,
                fontWeight: 700,
                color: "#1F1A14",
                lineHeight: 1.05,
                marginTop: 10,
                letterSpacing: -2,
              }}
            >
              {topic}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 24,
                marginTop: 36,
              }}
            >
              <div
                style={{
                  fontFamily: "serif",
                  fontSize: 180,
                  fontWeight: 800,
                  color: "#FD4401",
                  lineHeight: 0.85,
                  letterSpacing: -6,
                }}
              >
                {accuracy}%
              </div>
              <div
                style={{
                  fontSize: 32,
                  fontFamily: "monospace",
                  color: "#5C4C3F",
                }}
              >
                {score}/{total} correct
              </div>
            </div>
          </div>

          {/* Chick — simplified SVG-ish using nested divs */}
          <ChickImage state={chickFace} />
        </div>

        {/* Bottom CTA */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 36,
            paddingTop: 30,
            borderTop: "2px solid rgba(31,26,20,0.08)",
          }}
        >
          <div
            style={{
              fontSize: 26,
              color: "#1F1A14",
              maxWidth: 720,
              lineHeight: 1.3,
            }}
          >
            Get an AI diagnosis on every wrong answer — not just a score.
          </div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: "#FD4401",
              padding: "14px 24px",
              borderRadius: 18,
              background: "rgba(253,68,1,0.1)",
            }}
          >
            examgrind.vercel.app
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

/**
 * Tiny inline chick rendered with nested divs (next/og only supports a
 * subset of CSS — no <svg>, no Tailwind, no external images). We fake the
 * silhouette with carefully sized circles.
 */
function ChickImage({ state }: { state: "happy" | "idle" | "sad" }) {
  const eyeShape = state === "happy" ? "happy" : "open";
  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        width: 320,
        height: 320,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Body */}
      <div
        style={{
          display: "flex",
          width: 280,
          height: 280,
          borderRadius: 9999,
          background:
            "radial-gradient(circle at 45% 30%, #FFF1A8 0%, #FDD647 60%, #E5A823 100%)",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 30px 50px -20px rgba(229,168,35,0.4)",
        }}
      >
        {/* Tuft */}
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 130,
            width: 28,
            height: 28,
            borderRadius: 9999,
            background: "#E5A823",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 4,
            left: 148,
            width: 32,
            height: 32,
            borderRadius: 9999,
            background: "#E5A823",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 168,
            width: 28,
            height: 28,
            borderRadius: 9999,
            background: "#E5A823",
            display: "flex",
          }}
        />

        {/* Cheek L */}
        <div
          style={{
            position: "absolute",
            top: 138,
            left: 50,
            width: 50,
            height: 32,
            borderRadius: 9999,
            background: "rgba(255,143,160,0.55)",
            display: "flex",
          }}
        />
        {/* Cheek R */}
        <div
          style={{
            position: "absolute",
            top: 138,
            left: 220,
            width: 50,
            height: 32,
            borderRadius: 9999,
            background: "rgba(255,143,160,0.55)",
            display: "flex",
          }}
        />

        {/* Eyes */}
        {eyeShape === "happy" ? (
          <>
            <div
              style={{
                position: "absolute",
                top: 118,
                left: 88,
                width: 36,
                height: 18,
                borderTop: "6px solid #1F1A14",
                borderRadius: "100% 100% 0 0",
                display: "flex",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 118,
                left: 200,
                width: 36,
                height: 18,
                borderTop: "6px solid #1F1A14",
                borderRadius: "100% 100% 0 0",
                display: "flex",
              }}
            />
          </>
        ) : (
          <>
            <div
              style={{
                position: "absolute",
                top: 116,
                left: 92,
                width: 30,
                height: 38,
                borderRadius: 9999,
                background: "#1F1A14",
                display: "flex",
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 9999,
                  background: "#FFFDF6",
                  marginTop: 6,
                  marginLeft: 4,
                  display: "flex",
                }}
              />
            </div>
            <div
              style={{
                position: "absolute",
                top: 116,
                left: 200,
                width: 30,
                height: 38,
                borderRadius: 9999,
                background: "#1F1A14",
                display: "flex",
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 9999,
                  background: "#FFFDF6",
                  marginTop: 6,
                  marginLeft: 4,
                  display: "flex",
                }}
              />
            </div>
          </>
        )}

        {/* Beak */}
        <div
          style={{
            position: "absolute",
            top: 168,
            left: 138,
            width: 0,
            height: 0,
            borderLeft: "22px solid transparent",
            borderRight: "22px solid transparent",
            borderTop: "32px solid #FD7C29",
            display: "flex",
          }}
        />
      </div>
    </div>
  );
}
