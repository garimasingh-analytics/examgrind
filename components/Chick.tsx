"use client";

import Image from "next/image";
import { useChickVariant } from "./ChickVariantContext";
import type { ChickVariant } from "@/lib/chicks";

/**
 * ExamGrind's single mascot component.
 *
 * Every place in the product uses this component, so the character stays
 * recognisable while its expression changes with the student's moment.
 */
export type ChickState = "idle" | "happy" | "sad" | "frustrated" | "excited";

type Props = {
  state?: ChickState;
  /** Pixel size. The artwork is rendered inside a square frame. */
  size?: number;
  className?: string;
  /** Kept for existing profile customisation calls. */
  variant?: ChickVariant;
};

const ART_BY_STATE: Record<ChickState, string> = {
  idle: "/chick/examgrind-idle.png",
  happy: "/chick/examgrind-happy.png",
  sad: "/chick/examgrind-sad.png",
  frustrated: "/chick/examgrind-frustrated.png",
  excited: "/chick/examgrind-excited.png",
};

const MOTION_BY_STATE: Record<ChickState, string> = {
  idle: "animate-chick-idle",
  happy: "animate-chick-happy",
  sad: "animate-chick-sad",
  frustrated: "animate-chick-frustrated",
  excited: "animate-chick-excited",
};

// Wardrobe items are complete painted characters, not CSS hats or badges.
// That keeps each unlock legible and rewarding even in the small app shell.
const WARDROBE_ART: Partial<Record<ChickVariant, string>> = {
  scholar: "/chick/wardrobe/scholar.png",
  ninja: "/chick/wardrobe/ninja.png",
  bookworm: "/chick/wardrobe/bookworm.png",
  dragon: "/chick/wardrobe/dragon.png",
  doctor: "/chick/wardrobe/doctor.png",
  cyber: "/chick/wardrobe/cyber.png",
  police: "/chick/wardrobe/police.png",
  warrior: "/chick/wardrobe/warrior.png",
  royal: "/chick/wardrobe/royal.png",
  cosmic: "/chick/wardrobe/cosmic.png",
  squad: "/chick/wardrobe/squad.png",
  phoenix: "/chick/wardrobe/phoenix.png",
};

export default function Chick({
  state = "idle",
  size = 140,
  className = "",
  variant,
}: Props) {
  const { variant: savedVariant } = useChickVariant();
  const activeVariant = variant ?? savedVariant;
  const wardrobeArt = WARDROBE_ART[activeVariant];
  const imageSource = wardrobeArt ?? ART_BY_STATE[state];

  return (
    <span
      aria-hidden="true"
      className={`eg-chick relative inline-flex shrink-0 select-none items-center justify-center ${className}`}
      data-chick-state={state}
      data-chick-variant={activeVariant}
      style={{ width: size, height: size }}
    >
      {state === "excited" && <span className="eg-chick-spark eg-chick-spark-one">✦</span>}
      {state === "excited" && <span className="eg-chick-spark eg-chick-spark-two">✦</span>}
      <Image
        alt=""
        src={imageSource}
        width={640}
        height={640}
        draggable={false}
        className={`eg-chick-main h-full w-full object-contain ${MOTION_BY_STATE[state]}`}
        sizes={`${Math.max(48, Math.round(size))}px`}
      />
      {state === "excited" && !wardrobeArt && (
        <Image
          alt=""
          src="/chick/examgrind-excited-flap.png"
          width={640}
          height={640}
          draggable={false}
          className="eg-chick-flap-frame pointer-events-none absolute inset-0 h-full w-full object-contain"
          sizes={`${Math.max(48, Math.round(size))}px`}
        />
      )}
      {state === "sad" && <span className="eg-chick-tear" />}
    </span>
  );
}
