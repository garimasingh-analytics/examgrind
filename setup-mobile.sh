#!/bin/bash
# setup-mobile.sh — one-time scaffolding for the ExamGrind native apps.
#
# Run this once per machine. It:
#   1. Installs Capacitor + the Android/iOS platform plugins.
#   2. Initialises the native projects (./android and ./ios).
#   3. Syncs the capacitor.config.ts you've already got in this repo.
#
# After this finishes, see MOBILE_SETUP.md for what to do in Android
# Studio / Xcode to actually build + sign + ship the APK / IPA.
#
# Usage:
#   cd "Cuet exam app/cuet-quiz-app"
#   bash setup-mobile.sh

set -e

# --- Sanity ---------------------------------------------------------
if [ ! -f "capacitor.config.ts" ]; then
  echo "ERROR: capacitor.config.ts not found. Are you in cuet-quiz-app?"
  exit 1
fi

# --- 1. Install Capacitor SDK + CLI + platform plugins -------------
echo "Installing Capacitor packages…"
npm install --save \
  @capacitor/core \
  @capacitor/android \
  @capacitor/ios \
  @capacitor/splash-screen \
  @capacitor/status-bar
npm install --save-dev @capacitor/cli

# --- 2. Initialise (only writes android/ + ios/ if missing) --------
# Capacitor's init asks 3 questions interactively. We've already set
# appId + appName in capacitor.config.ts so init is a no-op for those.
# Adding the platforms is what actually scaffolds the native projects.
if [ ! -d "android" ]; then
  echo "Scaffolding Android project…"
  npx cap add android
else
  echo "android/ already exists — skipping cap add android."
fi

if [ ! -d "ios" ]; then
  # iOS only works on macOS; skip gracefully on Linux.
  if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "Scaffolding iOS project…"
    npx cap add ios
  else
    echo "Not on macOS — skipping iOS scaffold. Build the iOS app on a Mac later."
  fi
else
  echo "ios/ already exists — skipping cap add ios."
fi

# --- 3. Sync config + web assets into the native projects ----------
echo "Syncing Capacitor config into native projects…"
npx cap sync

cat <<'EOF'

────────────────────────────────────────────────────────────────────
Mobile scaffolding is done. Next steps:

  Android (Play Store-ready APK / AAB):
    1. Open Android Studio:    npx cap open android
    2. Build → Build Bundle(s) / APK(s) → Build APK / AAB
    3. Sign with your release key (see MOBILE_SETUP.md for keystore
       generation if you don't have one yet).

  iOS (App Store-ready IPA — Mac only):
    1. Open Xcode:             npx cap open ios
    2. Set the bundle ID and Team in Signing & Capabilities.
    3. Product → Archive → Distribute App → App Store Connect.

  Every web change → after vercel deploys, you don't need to rebuild
  the native app — the WebView reloads the new content automatically.
  Only rebuild the native shell when you change capacitor.config.ts,
  splash, icons, or plugin versions.

  Full instructions: MOBILE_SETUP.md
────────────────────────────────────────────────────────────────────
EOF
