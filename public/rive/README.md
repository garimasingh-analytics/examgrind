# Rive assets

Drop `chick-master.riv` here once the rig is built in rive.app.

## Required spec (matches `components/ChickRive.tsx`)

- **Artboard:** `Chick` (512×512, transparent)
- **State Machine:** `Chick`
- **Inputs:**
  - `state` — Number, 0–4 (drives which animation plays)
    - 0 = idle
    - 1 = happy
    - 2 = sad
    - 3 = frustrated
    - 4 = excited
  - `intensity` — Number, 0–100 (amplifies the active animation)
- **Animations** (named timelines, one per state) — see `docs/RIVE_RIG_SPEC.md`

## Drop-in test

Once `chick-master.riv` is here:

1. `npm run dev`
2. Open any page that uses `<ChickRive />`
3. State changes should drive the Rive animation, not the SVG fallback

If you see the SVG mascot instead of Rive, the file isn't loading. Check the
browser console — `useRive` will log any parse errors.

## Fallback behavior

`ChickRive.tsx` HEAD-probes this file on mount. If 404, it renders `<Chick />`
(the existing SVG) with the same props. So the app stays functional even
before this file exists.
