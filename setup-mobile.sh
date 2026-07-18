#!/bin/bash
# setup-mobile.sh — one-time Capacitor + Android scaffold for ExamGrind
#
# Prereqs (install once on your Mac):
#   1. Node 20+          brew install node
#   2. Java 17+ (JDK)    brew install --cask temurin
#      → confirm: java -version  → should say 17.x or higher
#   3. Android Studio    https://developer.android.com/studio
#      → open it once, let it install the Android SDK
#      → in Preferences → Appearance & Behavior → System Settings → Android SDK,
#        confirm "Android 14 (API 34)" is installed
#
# After prereqs, just run:
#   cd "Cuet exam app/cuet-quiz-app"
#   bash setup-mobile.sh
#
# Idempotent — safe to re-run any time.

set -e

cd "$(dirname "$0")"

echo "==============================================="
echo "  ExamGrind — Mobile Setup (Android)"
echo "==============================================="
echo ""

# --- 1. Sanity checks ---
if [ ! -f "capacitor.config.ts" ]; then
  echo "🚨 capacitor.config.ts not found. Are you in cuet-quiz-app?"
  exit 1
fi
if ! command -v node >/dev/null 2>&1; then
  echo "🚨 Node isn't installed. Install with: brew install node"
  exit 1
fi
if ! command -v java >/dev/null 2>&1; then
  echo "🚨 Java not installed. Install with: brew install --cask temurin"
  echo "   Then re-run this script."
  exit 1
fi
JAVA_MAJOR=$(java -version 2>&1 | head -1 | sed 's/.*"\([0-9]*\).*/\1/')
if [ "${JAVA_MAJOR:-0}" -lt 17 ]; then
  echo "🚨 Java version is $JAVA_MAJOR — need 17 or later."
  echo "   Install with: brew install --cask temurin"
  exit 1
fi

echo "✓ Node $(node --version) · Java $JAVA_MAJOR"
echo ""

# --- 2. Install dependencies (Capacitor pkgs are now in package.json) ---
echo "==> Installing npm packages (2-3 min the first time)..."
npm install --no-audit --no-fund
echo "✓ Dependencies installed"
echo ""

# --- 3. Add Android platform (creates android/ folder if missing) ---
if [ -d "android" ]; then
  echo "==> android/ folder already exists — skipping cap add"
else
  echo "==> Adding Android platform..."
  npx cap add android
  echo "✓ android/ folder created"
fi
echo ""

# --- 4. Add iOS platform only if on macOS + Xcode present ---
if [[ "$OSTYPE" == "darwin"* ]] && command -v xcodebuild >/dev/null 2>&1; then
  if [ -d "ios" ]; then
    echo "==> ios/ folder already exists — skipping cap add"
  else
    echo "==> Adding iOS platform (Xcode detected)..."
    npx cap add ios
    echo "✓ ios/ folder created"
  fi
else
  echo "==> Skipping iOS — Xcode not installed (fine, do that later)"
fi
echo ""

# --- 5. Generate icons + splash from resources/chick ---
echo "==> Generating chick icons + splash at all Android densities..."
npx capacitor-assets generate --android
echo "✓ Icons + splash generated"
echo ""

# --- 6. Sync config + web assets into native projects ---
echo "==> Syncing native project..."
npx cap sync
echo "✓ Sync complete"
echo ""

# --- 7. Next steps ---
cat <<'EOF'
===============================================
  ✓ Ready to install on your phone!
===============================================

Next steps:
  1. Plug your Android phone into your Mac via USB.
  2. On your phone: enable Developer Options + USB Debugging
     (Settings → About phone → tap Build number 7 times → back →
      Developer Options → USB debugging ON)
  3. Run:  npx cap open android
     Android Studio opens the ExamGrind project.
  4. In the top toolbar, pick your connected phone from the device dropdown.
  5. Click the green ▶ Run button.
     First build takes 3-5 min; subsequent builds are fast.
  6. App installs on your phone with the chick icon.

Every WEB change → after Vercel deploys, you DON'T rebuild the native
app. The WebView pulls the new content on next launch.
Rebuild native ONLY when:
  - capacitor.config.ts changes
  - Icon or splash changes
  - Plugin versions bump

Full instructions:  MOBILE_SETUP.md
EOF
