"use client";

/**
 * Chick — the mascot.
 *
 * v4: hand-coded SVG chick built to match the fluffy 3D-render reference
 *     (egg-shaped yellow body, huge shiny eyes, blush cheeks, tiny tuft,
 *     orange beak with open mouth, chunky orange feet).
 *
 *     Implements the five emotion states described in chick_emotion_engine.json:
 *
 *     - idle        → gentle breathing + subtle bob
 *     - happy       → rhythmic swaying, half-moon ^_^ eyes, soft smile, +20% blush
 *     - sad         → slow deflation, drooped lids + big pupils, downturned beak, tear
 *     - frustrated  → tight jittery vibrations, lowered brows, rigid wings out, +40% red cheeks
 *     - excited     → vertical bouncing, wide sparkly eyes, open "cheep" beak, rapid wing flap (1.5×)
 */

export type ChickState = "idle" | "happy" | "sad" | "frustrated" | "excited";

type Props = {
  state?: ChickState;
  /** Pixel size — height matches width (the SVG is square). */
  size?: number;
  className?: string;
};

export default function Chick({
  state = "idle",
  size = 140,
  className = "",
}: Props) {
  const animClass = {
    idle:        "animate-chick-idle",
    happy:       "animate-chick-happy",
    sad:         "animate-chick-sad",
    frustrated:  "animate-chick-frustrated",
    excited:     "animate-chick-excited",
  }[state];

  return (
    <div
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {state === "excited" && <SparkleField />}

      <svg
        viewBox="0 0 220 220"
        width={size}
        height={size}
        className={animClass}
        style={{ display: "block", overflow: "visible" }}
      >
        <defs>
          {/* Soft 3D-ish gradient for the body (warm yellow → deeper yellow) */}
          <radialGradient id="chickBody" cx="42%" cy="32%" r="78%">
            <stop offset="0%"   stopColor="#FFF1A8" />
            <stop offset="55%"  stopColor="#FDD647" />
            <stop offset="100%" stopColor="#E5A823" />
          </radialGradient>
          {/* Subtle inner belly highlight */}
          <radialGradient id="chickBelly" cx="50%" cy="50%" r="60%">
            <stop offset="0%"  stopColor="#FFF6C8" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#FFF6C8" stopOpacity="0" />
          </radialGradient>
          {/* Cheek blush gradient */}
          <radialGradient id="cheekBlush" cx="50%" cy="50%" r="55%">
            <stop offset="0%"   stopColor="#FFB1B8" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#FFB1B8" stopOpacity="0" />
          </radialGradient>
          {/* Beak gradient */}
          <linearGradient id="beakGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#FFA94D" />
            <stop offset="100%" stopColor="#F76707" />
          </linearGradient>
          {/* Soft fur edge filter (slight blur on body silhouette) */}
          <filter id="furSoft" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="0.6" />
          </filter>
          {/* Eye sphere — brown→black radial */}
          <radialGradient id="eyeSphere" cx="35%" cy="30%" r="80%">
            <stop offset="0%"  stopColor="#5A3A1F" />
            <stop offset="55%" stopColor="#1A0F06" />
            <stop offset="100%" stopColor="#000" />
          </radialGradient>
        </defs>

        {/* ---- Soft ground shadow ---- */}
        <ellipse
          cx="110" cy="206" rx="62" ry="6"
          fill="#1F1A14" opacity="0.10"
          className={
            state === "excited" ? "chick-shadow-bounce"
          : state === "happy"   ? "chick-shadow-sway"
          : undefined
          }
        />

        {/* ---- Wings (rendered behind body so they peek at sides) ---- */}
        <g
          className={
            state === "excited"   ? "chick-wings-flap"
          : state === "frustrated"? "chick-wings-rigid"
          : state === "sad"       ? "chick-wings-droop"
          : state === "happy"     ? "chick-wings-sway"
          : undefined
          }
          style={{ transformOrigin: "110px 130px" }}
        >
          <ellipse
            cx="28" cy="135" rx="12" ry="22"
            fill="#E5A823" filter="url(#furSoft)"
            transform="rotate(-12 28 135)"
          />
          <ellipse
            cx="192" cy="135" rx="12" ry="22"
            fill="#E5A823" filter="url(#furSoft)"
            transform="rotate(12 192 135)"
          />
        </g>

        {/* ---- Body (one big egg shape — no separate head, like the reference) ---- */}
        <g filter="url(#furSoft)">
          <ellipse cx="110" cy="118" rx="86" ry="90" fill="url(#chickBody)" />
          {/* Belly highlight to give roundness */}
          <ellipse cx="110" cy="146" rx="56" ry="48" fill="url(#chickBelly)" />
        </g>

        {/* ---- Tuft of fluff on top (3 small bumps) ---- */}
        <g>
          <circle cx="100" cy="36" r="6"  fill="#E5A823" />
          <circle cx="110" cy="28" r="8"  fill="#E5A823" />
          <circle cx="120" cy="36" r="6"  fill="#E5A823" />
        </g>

        {/* ---- Cheeks ---- */}
        <g
          className={
            state === "frustrated" ? "chick-cheeks-angry"
          : state === "happy"      ? "chick-cheeks-happy"
          : undefined
          }
        >
          <ellipse cx="58"  cy="128" rx="16" ry="10" fill="url(#cheekBlush)" />
          <ellipse cx="162" cy="128" rx="16" ry="10" fill="url(#cheekBlush)" />
        </g>

        {/* ---- Frustrated brows (only in frustrated state) ---- */}
        {state === "frustrated" && (
          <g stroke="#1F1A14" strokeWidth="3.5" strokeLinecap="round" fill="none">
            <path d="M70 88 L92 96" />
            <path d="M150 88 L128 96" />
          </g>
        )}

        {/* ---- Eyes ---- */}
        <Eyes state={state} />

        {/* ---- Beak + mouth ---- */}
        <Beak state={state} />

        {/* ---- Tear drop (sad only) ---- */}
        {state === "sad" && (
          <path
            className="chick-tear"
            d="M138 128 Q139 138 135 144 Q130 138 138 128 Z"
            fill="#7BC9F0"
          />
        )}

        {/* ---- Feet (two chunky orange feet at the base) ---- */}
        <g
          fill="url(#beakGrad)"
          stroke="#C2350A"
          strokeWidth="1"
          strokeLinejoin="round"
        >
          <Foot x={88} />
          <Foot x={132} />
        </g>
      </svg>
    </div>
  );
}

/* ---------------- Sub-pieces ---------------- */

function Eyes({ state }: { state: ChickState }) {
  // Happy: half-moon ^_^ smiling eyes
  if (state === "happy") {
    return (
      <g
        stroke="#1F1A14"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      >
        <path d="M70 100 Q82 90 94 100" />
        <path d="M126 100 Q138 90 150 100" />
      </g>
    );
  }

  // Sad: droopy lids on top, enlarged pupils
  if (state === "sad") {
    return (
      <g>
        {/* pupils — bigger */}
        <ellipse cx="82"  cy="108" rx="12" ry="14" fill="url(#eyeSphere)" />
        <ellipse cx="138" cy="108" rx="12" ry="14" fill="url(#eyeSphere)" />
        {/* highlights */}
        <circle  cx="78"  cy="103" r="3.6" fill="#FFFDF6" />
        <circle  cx="134" cy="103" r="3.6" fill="#FFFDF6" />
        <circle  cx="86"  cy="113" r="1.6" fill="#FFFDF6" />
        <circle  cx="142" cy="113" r="1.6" fill="#FFFDF6" />
        {/* drooped upper lids */}
        <path
          d="M68 100 Q82 96 96 102"
          stroke="#1F1A14"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M124 102 Q138 96 152 100"
          stroke="#1F1A14"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    );
  }

  // Frustrated: sharp focused, smaller pupils, tighter
  if (state === "frustrated") {
    return (
      <g>
        <ellipse cx="84"  cy="106" rx="7" ry="9" fill="url(#eyeSphere)" />
        <ellipse cx="136" cy="106" rx="7" ry="9" fill="url(#eyeSphere)" />
        <circle  cx="82"  cy="103" r="2.2" fill="#FFFDF6" />
        <circle  cx="134" cy="103" r="2.2" fill="#FFFDF6" />
      </g>
    );
  }

  // Excited: wide open with extra sparkle
  if (state === "excited") {
    return (
      <g>
        <ellipse cx="82"  cy="106" rx="11" ry="14" fill="url(#eyeSphere)" />
        <ellipse cx="138" cy="106" rx="11" ry="14" fill="url(#eyeSphere)" />
        <circle  cx="78"  cy="100" r="4.4" fill="#FFFDF6" />
        <circle  cx="134" cy="100" r="4.4" fill="#FFFDF6" />
        <circle  cx="86"  cy="111" r="2"   fill="#FFFDF6" />
        <circle  cx="142" cy="111" r="2"   fill="#FFFDF6" />
        {/* extra sparkle starlets in the eyes */}
        <path
          d="M82 96 l1.6 3 l3 0.8 l-3 0.8 l-1.6 3 l-1.6 -3 l-3 -0.8 l3 -0.8 z"
          fill="#FFFDF6" opacity="0.9"
        />
        <path
          d="M138 96 l1.6 3 l3 0.8 l-3 0.8 l-1.6 3 l-1.6 -3 l-3 -0.8 l3 -0.8 z"
          fill="#FFFDF6" opacity="0.9"
        />
      </g>
    );
  }

  // idle (default): big shiny anime eyes
  return (
    <g>
      <ellipse cx="82"  cy="106" rx="10.5" ry="13" fill="url(#eyeSphere)" />
      <ellipse cx="138" cy="106" rx="10.5" ry="13" fill="url(#eyeSphere)" />
      <circle  cx="78"  cy="101" r="3.6" fill="#FFFDF6" />
      <circle  cx="134" cy="101" r="3.6" fill="#FFFDF6" />
      <circle  cx="86"  cy="112" r="1.6" fill="#FFFDF6" />
      <circle  cx="142" cy="112" r="1.6" fill="#FFFDF6" />
    </g>
  );
}

function Beak({ state }: { state: ChickState }) {
  // Excited: fully open "cheep" beak
  if (state === "excited") {
    return (
      <g>
        {/* upper beak */}
        <path
          d="M98 128 L122 128 L110 122 Z"
          fill="url(#beakGrad)"
        />
        {/* open mouth (pink interior) */}
        <ellipse cx="110" cy="138" rx="10" ry="7" fill="#C2350A" />
        {/* lower beak */}
        <path
          d="M98 128 L122 128 L110 148 Z"
          fill="url(#beakGrad)"
          opacity="0.95"
        />
      </g>
    );
  }

  // Sad: closed, corners turned down (small flat shape)
  if (state === "sad") {
    return (
      <g>
        <path
          d="M100 132 Q110 128 120 132 Q110 138 100 132 Z"
          fill="url(#beakGrad)"
        />
        <path
          d="M100 132 Q110 138 120 132"
          stroke="#C2350A" strokeWidth="1"
          fill="none" strokeLinecap="round"
        />
      </g>
    );
  }

  // Frustrated: tight, slightly clenched line
  if (state === "frustrated") {
    return (
      <g className="chick-beak-click">
        <path
          d="M100 130 L120 130 L110 138 Z"
          fill="url(#beakGrad)"
        />
        <path
          d="M100 130 L120 130"
          stroke="#C2350A" strokeWidth="1.2" strokeLinecap="round"
        />
      </g>
    );
  }

  // Happy: soft smile beak with corners up + a tiny pink tongue
  if (state === "happy") {
    return (
      <g>
        <path
          d="M98 128 Q110 124 122 128 Q110 142 98 128 Z"
          fill="url(#beakGrad)"
        />
        <path
          d="M104 134 Q110 140 116 134"
          stroke="#C2350A" strokeWidth="2"
          fill="#FF8FA0" strokeLinecap="round"
        />
      </g>
    );
  }

  // idle: simple closed beak triangle, corners neutral
  return (
    <g>
      <path
        d="M100 128 L120 128 L110 142 Z"
        fill="url(#beakGrad)"
      />
      <path
        d="M100 128 Q110 132 120 128"
        stroke="#C2350A" strokeWidth="1"
        fill="none" strokeLinecap="round"
      />
    </g>
  );
}

function Foot({ x }: { x: number }) {
  return (
    <g>
      {/* leg stub */}
      <rect x={x + 6} y={196} width={6} height={6} rx={2} />
      {/* three toes */}
      <path d={`M${x} 210 L${x - 2} 218 L${x + 4} 214 Z`} />
      <path d={`M${x + 6} 210 L${x + 6} 220 L${x + 12} 220 L${x + 12} 210 Z`} />
      <path d={`M${x + 18} 210 L${x + 20} 218 L${x + 14} 214 Z`} />
    </g>
  );
}

function SparkleField() {
  return (
    <>
      <Sparkle x="14%" y="20%" delay="0s"    size={14} />
      <Sparkle x="84%" y="16%" delay="0.18s" size={12} />
      <Sparkle x="6%"  y="56%" delay="0.32s" size={10} />
      <Sparkle x="92%" y="62%" delay="0.46s" size={14} />
      <Sparkle x="50%" y="6%"  delay="0.6s"  size={11} />
    </>
  );
}

function Sparkle({
  x, y, delay, size = 12,
}: { x: string; y: string; delay: string; size?: number }) {
  return (
    <span
      className="chick-sparkle"
      style={{ left: x, top: y, animationDelay: delay, width: size, height: size }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" width={size} height={size}>
        <path
          d="M12 2 L13.6 10.4 L22 12 L13.6 13.6 L12 22 L10.4 13.6 L2 12 L10.4 10.4 Z"
          fill="#FDCB40"
        />
      </svg>
    </span>
  );
}
