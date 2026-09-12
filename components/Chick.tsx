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

// The body stays recognisably ExamGrind everywhere. A student's chosen
// wardrobe item is a small, readable accessory rather than a different
// mascot pasted into each screen.
const ACCESSORY_BY_VARIANT: Partial<Record<ChickVariant, { label: string; className: string }>> = {
  scholar: { label: "Graduation cap", className: "eg-chick-accessory-cap" },
  ninja: { label: "Red focus headband", className: "eg-chick-accessory-headband" },
  bookworm: { label: "Reading glasses", className: "eg-chick-accessory-glasses" },
  dragon: { label: "Dragon horns", className: "eg-chick-accessory-horns" },
  doctor: { label: "Doctor's stethoscope", className: "eg-chick-accessory-stethoscope" },
  cyber: { label: "Cyber visor", className: "eg-chick-accessory-visor" },
  police: { label: "SSC selection beret", className: "eg-chick-accessory-beret" },
  warrior: { label: "Warrior headguard", className: "eg-chick-accessory-helmet" },
  royal: { label: "Premium crown", className: "eg-chick-accessory-crown" },
  cosmic: { label: "Cosmic aura", className: "eg-chick-accessory-cosmic" },
  squad: { label: "Squad pin", className: "eg-chick-accessory-squad" },
  phoenix: { label: "Phoenix flame", className: "eg-chick-accessory-phoenix" },
};

export default function Chick({
  state = "idle",
  size = 140,
  className = "",
  variant,
}: Props) {
  const { variant: savedVariant } = useChickVariant();
  const activeVariant = variant ?? savedVariant;
  const accessory = ACCESSORY_BY_VARIANT[activeVariant];

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
        src={ART_BY_STATE[state]}
        width={640}
        height={640}
        draggable={false}
        className={`eg-chick-main h-full w-full object-contain ${MOTION_BY_STATE[state]}`}
        sizes={`${Math.max(48, Math.round(size))}px`}
      />
      {state === "excited" && (
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
      {accessory && <span aria-label={accessory.label} className={`eg-chick-accessory ${accessory.className}`} />}
    </span>
  );
}
