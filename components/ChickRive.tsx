"use client";

import { useEffect, useState } from "react";
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import Chick, { type ChickState } from "./Chick";
import type { ChickVariant } from "@/lib/chicks";

/**
 * ChickRive — the Rive-powered version of <Chick />.
 *
 * Drop-in replacement for <Chick />. Same props, same 5 states.
 *
 * If /rive/chick-master.riv is present, renders the Rive animation and
 * drives its `state` input (0=idle, 1=happy, 2=sad, 3=frustrated, 4=excited).
 *
 * If the .riv file doesn't exist yet (i.e. Day 4 rig still being built),
 * falls back transparently to the existing SVG <Chick />. No app code needs
 * to change to switch from SVG to Rive — just drop chick-master.riv into
 * public/rive/ and refresh.
 *
 * State machine + input names must match the Rive editor:
 *   Artboard:       "Chick"
 *   State Machine:  "Chick"
 *   Input:          "state" (Number, 0-4)
 *   Input:          "intensity" (Number, 0-100) — optional, only used for streak-fire
 */

const STATE_TO_NUMBER: Record<ChickState, number> = {
  idle: 0,
  happy: 1,
  sad: 2,
  frustrated: 3,
  excited: 4,
};

type Props = {
  state?: ChickState;
  size?: number;
  className?: string;
  variant?: ChickVariant;
  /**
   * Animation intensity (0-100). Used for streak-fire flames, score-pop scale,
   * etc. Ignored by simple states (idle/sad). Default: 0.
   */
  intensity?: number;
  /**
   * If true, skips the Rive load entirely and renders the SVG fallback.
   * Useful for low-power devices or test environments.
   */
  forceFallback?: boolean;
};

export default function ChickRive({
  state = "idle",
  size = 140,
  className = "",
  variant,
  intensity = 0,
  forceFallback = false,
}: Props) {
  const [riveAvailable, setRiveAvailable] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(false);

  // Probe whether the .riv file exists once on mount. If not, fall back.
  useEffect(() => {
    if (forceFallback) {
      setRiveAvailable(false);
      setChecked(true);
      return;
    }
    let cancelled = false;
    fetch("/rive/chick-master.riv", { method: "HEAD" })
      .then((r) => {
        if (!cancelled) {
          setRiveAvailable(r.ok);
          setChecked(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setRiveAvailable(false);
          setChecked(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [forceFallback]);

  // While probing, render SVG so we never flash empty. After probe, render
  // whichever the result says.
  if (!checked || !riveAvailable) {
    return (
      <Chick
        state={state}
        size={size}
        className={className}
        variant={variant}
      />
    );
  }

  return (
    <ChickRiveInner
      state={state}
      size={size}
      className={className}
      intensity={intensity}
    />
  );
}

/**
 * The actual Rive renderer. Split out so useRive() only runs after we've
 * confirmed the .riv exists — useRive throws ugly console errors on 404.
 */
function ChickRiveInner({
  state,
  size,
  className,
  intensity,
}: {
  state: ChickState;
  size: number;
  className: string;
  intensity: number;
}) {
  const { rive, RiveComponent } = useRive({
    src: "/rive/chick-master.riv",
    artboard: "Chick",
    stateMachines: "Chick",
    autoplay: true,
  });

  const stateInput = useStateMachineInput(rive, "Chick", "state");
  const intensityInput = useStateMachineInput(rive, "Chick", "intensity");

  useEffect(() => {
    if (stateInput) stateInput.value = STATE_TO_NUMBER[state];
  }, [stateInput, state]);

  useEffect(() => {
    if (intensityInput) intensityInput.value = intensity;
  }, [intensityInput, intensity]);

  return (
    <div className={className} style={{ width: size, height: size }}>
      <RiveComponent />
    </div>
  );
}

// Re-export ChickState so callers can `import { ChickState } from "./ChickRive"`
// without also reaching into Chick.tsx.
export type { ChickState };
