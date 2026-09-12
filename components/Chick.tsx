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

export default function Chick({
  state = "idle",
  size = 140,
  className = "",
  variant,
}: Props) {
  const { variant: savedVariant } = useChickVariant();
  const activeVariant = variant ?? savedVariant;

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
        className={`h-full w-full object-contain ${MOTION_BY_STATE[state]}`}
        sizes={`${Math.max(48, Math.round(size))}px`}
      />
      {state === "sad" && <span className="eg-chick-tear" />}
    </span>
  );
}
