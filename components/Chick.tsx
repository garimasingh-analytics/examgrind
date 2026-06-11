"use client";

import { useChickVariant } from "./ChickVariantContext";
import type { ChickVariant } from "@/lib/chicks";

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
  /** Cosmetic skin. If omitted, reads from ChickVariantContext (user's pick). */
  variant?: ChickVariant;
};

export default function Chick({
  state = "idle",
  size = 140,
  className = "",
  variant,
}: Props) {
  const { variant: ctxVariant } = useChickVariant();
  const resolvedVariant: ChickVariant = variant ?? ctxVariant;
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

        {/* ---- Cosmetic skin overlay ---- */}
        <ChickAccessory variant={resolvedVariant} />
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

/* ---------------- Cosmetic accessory overlays ---------------- */
/**
 * Each variant renders zero or more SVG groups on top of the base chick.
 * The base chick is identical across variants — only this layer changes.
 * Positions are all within the same 220x220 viewBox.
 */
function ChickAccessory({ variant }: { variant: ChickVariant }) {
  if (variant === "classic") return null;

  if (variant === "scholar") {
    // Black mortarboard cap + yellow tassel hanging off the right
    return (
      <g>
        {/* shadow under cap */}
        <ellipse cx="110" cy="40" rx="62" ry="6" fill="#000" opacity="0.18" />
        {/* cap band (around head) */}
        <ellipse cx="110" cy="34" rx="60" ry="9" fill="#1F1A14" />
        {/* mortarboard square top — slight perspective */}
        <polygon
          points="42,28 178,28 172,16 48,16"
          fill="#1F1A14"
          stroke="#000"
          strokeWidth="0.5"
        />
        {/* button on top */}
        <circle cx="110" cy="22" r="3" fill="#FDD647" />
        {/* tassel string */}
        <path
          d="M168 20 Q176 28 172 38"
          stroke="#FDD647"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        {/* tassel pom */}
        <g>
          <circle cx="172" cy="40" r="5" fill="#FDD647" />
          <circle cx="170" cy="44" r="2" fill="#E5A823" />
          <circle cx="174" cy="42" r="2" fill="#E5A823" />
        </g>
      </g>
    );
  }

  if (variant === "bookworm") {
    // Round black-rimmed glasses over both eyes + tiny bowtie for nerd-chic
    return (
      <g>
        {/* Glasses — left lens */}
        <circle
          cx="82" cy="108" r="20"
          fill="#FFFDF6" fillOpacity="0.18"
          stroke="#1F1A14" strokeWidth="3.5"
        />
        {/* Glasses — right lens */}
        <circle
          cx="138" cy="108" r="20"
          fill="#FFFDF6" fillOpacity="0.18"
          stroke="#1F1A14" strokeWidth="3.5"
        />
        {/* Bridge */}
        <line
          x1="102" y1="108" x2="118" y2="108"
          stroke="#1F1A14" strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* Lens shine highlights */}
        <ellipse cx="76" cy="100" rx="3" ry="5" fill="white" fillOpacity="0.65" />
        <ellipse cx="132" cy="100" rx="3" ry="5" fill="white" fillOpacity="0.65" />
        {/* Tiny red bowtie below beak — nerdy & cute */}
        <g transform="translate(110 165)">
          <polygon points="-12,-6 0,0 -12,6" fill="#FF6B6B" />
          <polygon points="12,-6 0,0 12,6" fill="#FF6B6B" />
          <circle cx="0" cy="0" r="3" fill="#C2350A" />
        </g>
      </g>
    );
  }

  if (variant === "doctor") {
    // Stethoscope around neck — black tube + silver chest piece
    return (
      <g>
        {/* Earpieces (Y at top) */}
        <circle cx="72" cy="118" r="3" fill="#1F1A14" />
        <circle cx="148" cy="118" r="3" fill="#1F1A14" />
        {/* Left tube */}
        <path
          d="M72 122 Q56 140 78 168 L98 178"
          stroke="#1F1A14" strokeWidth="4" fill="none" strokeLinecap="round"
        />
        {/* Right tube */}
        <path
          d="M148 122 Q164 140 142 168 L122 178"
          stroke="#1F1A14" strokeWidth="4" fill="none" strokeLinecap="round"
        />
        {/* Chest piece (silver disc) */}
        <circle cx="110" cy="184" r="11" fill="#D8D8DD" stroke="#666" strokeWidth="2" />
        <circle cx="110" cy="184" r="6" fill="#A8A8B0" />
        <circle cx="107" cy="181" r="2" fill="#FFFDF6" opacity="0.6" />
        {/* Red cross armband on left wing */}
        <g>
          <rect x="16" y="125" width="22" height="22" fill="#FFFDF6" rx="3" />
          <rect x="24" y="129" width="6" height="14" fill="#E03131" />
          <rect x="20" y="133" width="14" height="6" fill="#E03131" />
        </g>
      </g>
    );
  }

  if (variant === "police") {
    // Khaki/navy beret tilted left + gold star badge on chest
    return (
      <g>
        {/* Beret base shadow */}
        <ellipse cx="115" cy="38" rx="64" ry="7" fill="#000" opacity="0.15" />
        {/* Beret rim band */}
        <ellipse cx="115" cy="34" rx="62" ry="11" fill="#1B2557" />
        {/* Beret top — tilted poof */}
        <ellipse cx="128" cy="20" rx="46" ry="14" fill="#2C3E80" />
        {/* Beret highlight */}
        <ellipse cx="120" cy="16" rx="20" ry="5" fill="#3D52A5" opacity="0.6" />
        {/* Cap badge (gold star on beret) */}
        <polygon
          points="138,22 140,28 146,28 141,32 143,38 138,34 133,38 135,32 130,28 136,28"
          fill="#FDD647"
          stroke="#C2350A"
          strokeWidth="0.8"
        />
        {/* Star badge on chest */}
        <g>
          <circle cx="110" cy="158" r="14" fill="#FDD647" stroke="#C2350A" strokeWidth="1.5" />
          <polygon
            points="110,148 113,156 121,156 115,161 117,169 110,164 103,169 105,161 99,156 107,156"
            fill="#C2350A"
          />
        </g>
      </g>
    );
  }

  if (variant === "royal") {
    // Gold crown with gems + tiny red velvet cape behind body
    return (
      <g>
        {/* Cape — drawn behind body via negative offset & opacity layering */}
        <path
          d="M40 130 Q30 200 60 215 L160 215 Q190 200 180 130 Q150 145 110 145 Q70 145 40 130 Z"
          fill="#9E1B1B"
          opacity="0.0"
        />
        {/* (cape disabled in v1 because of z-order; crown alone is the marquee) */}

        {/* Crown shadow */}
        <ellipse cx="110" cy="42" rx="50" ry="5" fill="#000" opacity="0.15" />
        {/* Crown base band */}
        <rect x="62" y="34" width="96" height="10" fill="#FDD647" stroke="#C2350A" strokeWidth="1.2" />
        {/* Crown points (5 spikes) */}
        <path
          d="M62 34 L70 16 L82 30 L94 8 L110 28 L126 8 L138 30 L150 16 L158 34 Z"
          fill="#FDD647"
          stroke="#C2350A"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        {/* Gems on the band */}
        <circle cx="82" cy="39" r="3.5" fill="#FF6B6B" stroke="#9E1B1B" strokeWidth="0.6" />
        <circle cx="110" cy="39" r="4" fill="#7BC9F0" stroke="#1B2557" strokeWidth="0.6" />
        <circle cx="138" cy="39" r="3.5" fill="#9C4DD3" stroke="#5B2090" strokeWidth="0.6" />
        {/* Tip jewels (small dots on each spike) */}
        <circle cx="94" cy="8" r="2.5" fill="#FFFDF6" />
        <circle cx="110" cy="28" r="2.5" fill="#FFFDF6" />
        <circle cx="126" cy="8" r="2.5" fill="#FFFDF6" />
        {/* Sparkle accent */}
        <g opacity="0.85">
          <path d="M110 4 L112 8 L116 8 L113 11 L114 16 L110 13 L106 16 L107 11 L104 8 L108 8 Z" fill="#FFFDF6" />
        </g>
      </g>
    );
  }

  if (variant === "ninja") {
    // Red headband with rising-sun dot + black eye-band ninja mask + tiny shuriken
    return (
      <g>
        {/* Headband (wraps the head) */}
        <rect x="58" y="36" width="104" height="14" fill="#9E1B1B" rx="3" />
        {/* Rising-sun dot */}
        <circle cx="110" cy="43" r="5" fill="#FDD647" />
        {/* Headband tails flying back */}
        <path d="M62 40 Q40 50 38 72 Q48 66 56 52 Z" fill="#9E1B1B" />
        <path d="M158 40 Q180 50 182 72 Q172 66 164 52 Z" fill="#9E1B1B" />
        {/* Black mask band across upper eye area — eyes still visible below */}
        <rect x="50" y="86" width="120" height="14" fill="#1F1A14" rx="2" />
        {/* Pointed angles at outer edges of mask (ninja shape) */}
        <polygon points="50,86 38,84 50,100" fill="#1F1A14" />
        <polygon points="170,86 182,84 170,100" fill="#1F1A14" />
        {/* Shuriken on chest, rotated for dynamism */}
        <g transform="translate(110 160) rotate(20)">
          <polygon points="0,-11 4,-4 11,0 4,4 0,11 -4,4 -11,0 -4,-4" fill="#1F1A14" stroke="#000" strokeWidth="0.5" />
          <circle r="2.5" fill="#FDD647" />
        </g>
      </g>
    );
  }

  if (variant === "dragon") {
    // Two horns, scaled spine, fire wisp from beak, glowing eyes
    return (
      <g>
        {/* Left horn */}
        <path d="M86 22 L78 0 L94 18 Z" fill="#9E1B1B" stroke="#5A0A0A" strokeWidth="1.2" strokeLinejoin="round" />
        {/* Right horn */}
        <path d="M134 22 L142 0 L126 18 Z" fill="#9E1B1B" stroke="#5A0A0A" strokeWidth="1.2" strokeLinejoin="round" />
        {/* Spine scales (zigzag) */}
        <path
          d="M55 88 L65 78 L75 86 L85 76 L95 84 L105 74 L110 82 L115 74 L125 84 L135 76 L145 86 L155 78 L165 88"
          stroke="#9E1B1B" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round"
        />
        {/* Fire wisp from beak */}
        <g opacity="0.95">
          <path d="M114 156 Q132 158 144 174 Q138 184 124 178 Q118 168 114 156 Z" fill="#FF6B6B" />
          <path d="M118 158 Q130 162 137 172 Q131 178 124 172 Z" fill="#FDD647" />
          <ellipse cx="135" cy="170" rx="3" ry="2" fill="#FFFDF6" opacity="0.7" />
        </g>
        {/* Glowing red eye accents (rim) */}
        <circle cx="82" cy="108" r="14" fill="none" stroke="#FF6B6B" strokeWidth="1.5" opacity="0.6" />
        <circle cx="138" cy="108" r="14" fill="none" stroke="#FF6B6B" strokeWidth="1.5" opacity="0.6" />
      </g>
    );
  }

  if (variant === "cyber") {
    // Blue glowing visor + LED dots + chest emblem
    return (
      <g>
        {/* Visor band (dark base) */}
        <rect x="46" y="95" width="128" height="26" fill="#0F1B3D" rx="5" />
        {/* Visor band (mid layer) */}
        <rect x="50" y="100" width="120" height="14" fill="#1B3D7A" rx="3" />
        {/* Glowing blue stripe */}
        <rect x="52" y="104" width="116" height="6" fill="#3B82F6" />
        <rect x="52" y="105" width="116" height="3" fill="#7BC9F0" opacity="0.95" />
        {/* Highlight reflections on stripe */}
        <rect x="60" y="105" width="14" height="2" fill="#FFFDF6" opacity="0.8" />
        <rect x="140" y="105" width="14" height="2" fill="#FFFDF6" opacity="0.8" />
        {/* LED dots on temples (animated) */}
        <circle cx="44" cy="108" r="2.5" fill="#7BC9F0">
          <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="176" cy="108" r="2.5" fill="#7BC9F0">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" />
        </circle>
        {/* Tiny LED dots on head */}
        <circle cx="100" cy="30" r="1.5" fill="#7BC9F0" />
        <circle cx="120" cy="30" r="1.5" fill="#7BC9F0" />
        {/* Circuit traces on body */}
        <path d="M70 158 L92 158 L92 172 L108 172" stroke="#3B82F6" strokeWidth="1.5" fill="none" opacity="0.55" />
        <path d="M150 158 L128 158 L128 172 L112 172" stroke="#3B82F6" strokeWidth="1.5" fill="none" opacity="0.55" />
        {/* Chest emblem */}
        <circle cx="110" cy="180" r="7" fill="#0F1B3D" stroke="#3B82F6" strokeWidth="1.5" />
        <circle cx="110" cy="180" r="3" fill="#7BC9F0" />
      </g>
    );
  }

  if (variant === "warrior") {
    // Bronze Spartan helmet + red mohawk plume + small shield on wing
    return (
      <g>
        {/* Helmet shadow */}
        <ellipse cx="110" cy="50" rx="62" ry="6" fill="#000" opacity="0.18" />
        {/* Helmet dome (bronze) */}
        <path d="M48 46 Q48 12 110 12 Q172 12 172 46 L172 52 L48 52 Z"
              fill="#B8732B" stroke="#5A3A1F" strokeWidth="1.5" strokeLinejoin="round" />
        {/* Helmet brim shadow */}
        <rect x="48" y="46" width="124" height="7" fill="#5A3A1F" opacity="0.4" />
        {/* Bronze highlight (curved shine on top-left) */}
        <path d="M58 24 Q90 14 130 18" stroke="#FDD647" strokeWidth="2.5" fill="none" opacity="0.65" />
        {/* Cheek guards (sides) */}
        <path d="M48 46 L46 70 L58 78 L60 50 Z" fill="#B8732B" stroke="#5A3A1F" strokeWidth="1" />
        <path d="M172 46 L174 70 L162 78 L160 50 Z" fill="#B8732B" stroke="#5A3A1F" strokeWidth="1" />
        {/* Nose plate (vertical down to between eyes) */}
        <path d="M105 46 L105 86 L115 86 L115 46 Z" fill="#8B5A2B" stroke="#5A3A1F" strokeWidth="0.8" />
        {/* Mohawk plume (red bristles flowing back) */}
        <g>
          <path d="M85 12 L90 -6 L96 8 L102 -10 L108 10 L114 -10 L120 8 L126 -6 L132 12 Z"
                fill="#9E1B1B" stroke="#5A0A0A" strokeWidth="0.8" strokeLinejoin="round" />
          {/* Individual hair strands */}
          <path d="M90 -6 L92 -14" stroke="#9E1B1B" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M102 -10 L104 -18" stroke="#9E1B1B" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M114 -10 L116 -18" stroke="#9E1B1B" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M126 -6 L128 -14" stroke="#9E1B1B" strokeWidth="2.5" strokeLinecap="round" />
        </g>
        {/* Shield on left wing */}
        <g>
          <ellipse cx="22" cy="138" rx="13" ry="17" fill="#9E1B1B" stroke="#5A0A0A" strokeWidth="1.5" />
          {/* Shield cross emblem */}
          <path d="M22 124 L22 152" stroke="#FDD647" strokeWidth="2" />
          <path d="M11 138 L33 138" stroke="#FDD647" strokeWidth="2" />
          {/* Shield boss center */}
          <circle cx="22" cy="138" r="3" fill="#FDD647" />
        </g>
      </g>
    );
  }

  if (variant === "cosmic") {
    // Code-only rare: purple aura + star sparkles
    return (
      <g>
        {/* Aura halo */}
        <circle cx="110" cy="118" r="100" fill="none" stroke="#9C4DD3" strokeWidth="2" opacity="0.5">
          <animate attributeName="r" values="98;106;98" dur="3s" repeatCount="indefinite" />
        </circle>
        {/* Sparkles around the chick */}
        <g fill="#FFFDF6">
          <path d="M30 60 L32 56 L34 60 L38 62 L34 64 L32 68 L30 64 L26 62 Z" opacity="0.9" />
          <path d="M180 80 L182 76 L184 80 L188 82 L184 84 L182 88 L180 84 L176 82 Z" opacity="0.9" />
          <path d="M40 180 L42 176 L44 180 L48 182 L44 184 L42 188 L40 184 L36 182 Z" opacity="0.9" />
          <path d="M170 170 L172 166 L174 170 L178 172 L174 174 L172 178 L170 174 L166 172 Z" opacity="0.9" />
        </g>
        {/* Tiny stars on body (constellation pattern) */}
        <circle cx="90" cy="150" r="1.5" fill="#FFFDF6" />
        <circle cx="130" cy="160" r="1.5" fill="#FFFDF6" />
        <circle cx="100" cy="175" r="1.5" fill="#FFFDF6" />
        <circle cx="120" cy="175" r="1.5" fill="#FFFDF6" />
        {/* Crown-like tiny purple gem on head */}
        <path d="M105 22 L110 12 L115 22 Z" fill="#9C4DD3" stroke="#5B2090" strokeWidth="0.8" />
        <circle cx="110" cy="14" r="1.5" fill="#FFFDF6" />
      </g>
    );
  }

  if (variant === "squad") {
    // Code-only referral chick: heart accents + tiny "+1" badge
    return (
      <g>
        {/* Heart on chest */}
        <path
          d="M110 168 C105 158 88 158 88 168 C88 180 110 192 110 192 C110 192 132 180 132 168 C132 158 115 158 110 168 Z"
          fill="#FF6B6B" stroke="#9E1B1B" strokeWidth="1.2"
        />
        {/* Heart shine */}
        <ellipse cx="100" cy="170" rx="4" ry="3" fill="#FFFDF6" opacity="0.55" />
        {/* +1 badge on right shoulder */}
        <circle cx="178" cy="118" r="11" fill="#FDD647" stroke="#9E1B1B" strokeWidth="1.5" />
        <text x="178" y="123" textAnchor="middle" fontSize="13" fontWeight="700" fill="#9E1B1B" fontFamily="sans-serif">+1</text>
        {/* Tiny heart sparkles */}
        <path d="M50 80 L52 76 L54 80 L52 84 Z" fill="#FF6B6B" opacity="0.8" />
        <path d="M170 60 L172 56 L174 60 L172 64 Z" fill="#FF6B6B" opacity="0.8" />
      </g>
    );
  }

  if (variant === "phoenix") {
    // Code-only ultra-rare: flame trail + glowing red-orange aura
    return (
      <g>
        {/* Flame ring aura */}
        <g opacity="0.6">
          <circle cx="110" cy="118" r="95" fill="none" stroke="#FF6B6B" strokeWidth="3" opacity="0.7">
            <animate attributeName="opacity" values="0.7;0.3;0.7" dur="2s" repeatCount="indefinite" />
          </circle>
        </g>
        {/* Flame plumes (4 around the body) */}
        <g fill="#FF6B6B" opacity="0.85">
          <path d="M30 100 Q20 80 30 60 Q40 75 35 95 Z" />
          <path d="M190 100 Q200 80 190 60 Q180 75 185 95 Z" />
          <path d="M30 160 Q20 180 30 200 Q40 185 35 165 Z" />
          <path d="M190 160 Q200 180 190 200 Q180 185 185 165 Z" />
        </g>
        {/* Inner gold core on plumes */}
        <g fill="#FDD647" opacity="0.9">
          <path d="M33 95 Q26 82 32 70 Q36 80 34 92 Z" />
          <path d="M187 95 Q194 82 188 70 Q184 80 186 92 Z" />
        </g>
        {/* Tail feather flames behind */}
        <path d="M70 200 Q60 215 75 215 Q80 208 78 200 Z" fill="#FF6B6B" />
        <path d="M150 200 Q160 215 145 215 Q140 208 142 200 Z" fill="#FF6B6B" />
        {/* Glowing tuft on top */}
        <circle cx="110" cy="16" r="6" fill="#FDD647">
          <animate attributeName="r" values="6;8;6" dur="1.2s" repeatCount="indefinite" />
        </circle>
      </g>
    );
  }

  return null;
}
