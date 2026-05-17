# Chick mascot — Lottie animations

Drop chick animation JSON files here and the app picks them up automatically:

```
public/lottie/
├── chick-idle.json    ← shown when the chick is just hanging out
├── chick-happy.json   ← shown on results page when accuracy ≥ 70%
└── chick-sad.json     ← shown on results page when accuracy < 40%
```

If a state's file is missing, the app falls back to the hand-drawn SVG chick.

## Where to find Lottie animations

- **lottiefiles.com** — search for "chick", "baby chicken", "yellow chick", "easter chick"
- **lottiefiles.com/3d** — filter to 3D-rendered animations (look 3D, file is still 2D Lottie)
- **iconscout.com/lotties** — bigger library, mostly paid but has free options
- **rive.app** — alternative format if you want interactivity (not Lottie, won't work here)

## How to download

Most LottieFiles entries have a green **"Download"** button → choose **"Lottie JSON"** (not .lottie, not GIF). Save the file straight into `public/lottie/` with one of the three names above.

## Recommended search terms for cohesive style

To match the warm Maxima-Therapy palette, look for:
- "yellow chick 3D"
- "cute chick character"
- "baby chicken bouncing"
- "easter chick happy"

Aim for animations where the chick has big shiny eyes, a fluffy body, and a calm idle loop — those will sit well next to the rest of the app.
