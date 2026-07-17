# ExamGrind Chick Rive Rig — v1 Spec

**Purpose:** A single `.riv` file with 5 named animations and 2 input parameters that any page/reel can drop in and drive. Built once in Rive, reusable across Next.js (rive-react), Capacitor mobile, and reels (.mp4 export).

**Source asset:** The 8 chick mood SVGs already shipped in `public/chick/` (per task #129). The Rive rig reuses the same chick body and morphs facial/limb features into the 5 core states.

---

## Drive folder structure (create once)

```
ExamGrind/
  brand/
    logos/                  (existing — PNG + SVG)
    chick-skins/            (existing — 12 chick SVGs from migration 024)
  rive/
    chick-master.rive       (the source file you'll work in)
    chick-master.riv        (exported binary — what the app loads)
    states/                 (each animation exported as a 60fps MP4 for reels)
      idle.mp4
      celebrate.mp4
      think.mp4
      sad.mp4
      streak-fire.mp4
    docs/
      RIVE_RIG_SPEC.md     (this file)
  reels/
    raw-clips/
    finished/
```

Sharing: set `ExamGrind/` to "anyone with link can view" so designers/freelancers can drop assets in without OAuth back-and-forth.

---

## The rig (one Artboard, one State Machine)

**Artboard:** `Chick` — 512×512, transparent background.

### Inputs (drive these from React)

| Input | Type | Range | Purpose |
|---|---|---|---|
| `state` | Number | 0–4 | Picks the active animation: 0=idle, 1=happy, 2=sad, 3=frustrated, 4=excited |
| `intensity` | Number | 0–100 | Amplifies the active animation (streak fire size, bounce height, etc.) |

State names match the existing `<Chick />` SVG component (`components/Chick.tsx`) so `<ChickRive />` is a drop-in replacement.

### Animations (5 named timelines)

1. **`idle`** — 2s loop. Gentle breathing + subtle bob. Default state on page load.
2. **`happy`** — 1.5s one-shot. Rhythmic swaying, ^_^ eyes, soft smile, blush. Plays on quiz pass / streak milestone / payment success.
3. **`sad`** — 1.2s one-shot, then settle into slower idle. Drooped lids, downturned beak, tear drop. Plays on quiz fail / streak break.
4. **`frustrated`** — 1s loop. Tight jittery vibrations, lowered brows, rigid wings out, +40% red cheeks. Plays mid-quiz when stuck / wrong streak.
5. **`excited`** — 1.8s loop. Vertical bouncing, wide sparkly eyes, open "cheep" beak, rapid wing flap (1.5×). `intensity` controls bounce height + sparkle count. Plays on streak ≥7 / Premium unlock.

### State Machine wiring

```
   ┌──────┐  state=0   ┌──────┐
   │ idle │◄──────────►│ ...  │
   └──┬───┘            └──────┘
      │
      ├─ state=1 ──► celebrate ──(autocomplete)──► idle
      ├─ state=2 ──► think (loops until state changes)
      ├─ state=3 ──► sad ──(autocomplete)──► idle
      └─ state=4 ──► streak-fire (loops; intensity drives flame size)
```

Use **Any State → target** transitions for state=1/2/3/4 so the rig can interrupt mid-animation cleanly.

---

## React integration

`components/ChickRive.tsx` is **already built and shipped** — a drop-in
replacement for the existing `<Chick />` SVG component. It:

1. HEAD-probes `/rive/chick-master.riv` on mount
2. If 200 → loads the Rive rig and drives the state machine
3. If 404 → falls back to rendering `<Chick />` (the SVG) with the same props

So the app keeps working today even before the rig is built, and "upgrading"
a page from SVG to Rive is just changing the import.

Usage:
```tsx
import ChickRive from "@/components/ChickRive";

<ChickRive state="happy" />                          // quiz passed
<ChickRive state="frustrated" />                     // mid-quiz, stuck
<ChickRive state="excited" intensity={streak * 10} /> // streak display
```

**Upgrade path** — once `chick-master.riv` lives in `public/rive/`:
- Find usages of `<Chick />` and replace with `<ChickRive />` (identical API)
- Or do a global find/replace `import Chick` → `import ChickRive` (Chick.tsx itself stays as the fallback)

---

## What to do in the Rive editor (in order)

1. **Open rive.app**, sign in, **new file**, name it `chick-master`.
2. **Import** the most polished chick SVG from `public/chick/` (the v3 cuter mascot from task #2/#5). Place at 0,0 inside a 512×512 artboard.
3. **Rig the bones:** body (parent), head (child of body), beak (child of head), left-eye, right-eye, left-wing, right-wing, tail, left-foot, right-foot. Set rotation pivots correctly.
4. **Build animation 1 (`idle`)** first — gives you the baseline rig. 2s timeline, set head + tail keyframes. Test loop.
5. **Duplicate idle → modify into `celebrate`**, then think, sad, streak-fire. Reuse the same bone rig — different keyframes only.
6. **Add State Machine `Chick`**. Drag in two inputs (`state` number, `intensity` number). Wire transitions as shown above.
7. **Export** as `chick-master.riv` (binary) into `public/rive/` of the Next.js repo.
8. **Export each animation as MP4** at 1080×1080 60fps for reels (Rive → Export → Video).

Time estimate: 4-6 focused hours for someone new to Rive; 2-3 hours if you've shipped a Rive rig before. The bottleneck is animation 1 (the rig); animations 2-5 build fast on the same skeleton.

---

## Acceptance criteria (Day 4 done means)

- [ ] `public/rive/chick-master.riv` exists and is < 200KB
- [ ] `<ChickRive state="idle" />` renders without console errors on `/home`
- [ ] State change triggers correct animation within 100ms
- [ ] `intensity` slider visibly affects streak-fire flame size
- [ ] 5 MP4 exports saved to Drive `rive/states/` folder (for reel batch sprint Day 6-7)

---

## Day 5 (next) — once rig is locked

Template kit + carousel master + tone guide. With the rig in place, Day 5 is mostly Canva/figma work that references the rig states (e.g. carousel slide 1 shows `idle` chick, slide 6 shows `celebrate`).
