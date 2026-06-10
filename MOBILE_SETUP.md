# ExamGrind native apps — Capacitor setup + publish guide

We wrap the live web app at `examgrind.in` in a Capacitor WebView for Android + iOS. The reasoning is in the header comment of `capacitor.config.ts`. Short version: it keeps SSR + Supabase auth + Razorpay flows working unchanged, and every Vercel deploy is automatically a mobile update.

This guide assumes zero prior native-app experience. Follow it once per platform; after that, day-to-day mobile updates are free.

---

## One-time scaffolding (5 min)

From the project root (`Cuet exam app/cuet-quiz-app`):

```bash
bash setup-mobile.sh
```

The script installs Capacitor + the Android/iOS plugins, scaffolds the `android/` and `ios/` folders, and runs `npx cap sync`.

When it finishes, you'll have:

- `android/` — a real Android Studio project, openable in Android Studio.
- `ios/` — a real Xcode project, openable in Xcode (Mac only).

Neither folder gets committed to GitHub by default — they're added to `.gitignore` by `cap add`. The Vercel build doesn't touch them, so the web deploy is unaffected.

---

## Android — Play Store release (45 min the first time, 5 min after)

### Install Android Studio
1. Download Android Studio from <https://developer.android.com/studio>.
2. Open it once and let it install the SDK (Tools → SDK Manager → install Android 14 / API 34 + Build Tools).

### Generate your release signing key (do this once, then keep it safe forever)
```bash
keytool -genkey -v -keystore ~/examgrind-release.keystore \
  -alias examgrind -keyalg RSA -keysize 2048 -validity 10000
```

Answer the prompts. **Back up `~/examgrind-release.keystore` and your password to a password manager** — if you lose them you can never publish another update under the same app, you'll have to publish a new one.

### Build the AAB (Android App Bundle — what Play Store wants)
```bash
cd "Cuet exam app/cuet-quiz-app"
npx cap open android
```

In Android Studio:

1. Wait for the Gradle sync to finish (first time: ~5 min).
2. Build → Generate Signed Bundle / APK → Android App Bundle.
3. Pick your keystore from step above, enter the password, the alias is `examgrind`.
4. Pick **release** variant.
5. Build. The signed AAB lands in `android/app/release/app-release.aab`.

### Upload to Play Console
1. Sign in to <https://play.google.com/console>. First account costs a one-time **$25 USD**.
2. Create app → fill in basics (app name: ExamGrind, default language: English, app or game: app, free or paid: free).
3. Set up your store listing (short + full description, screenshots — take 4–6 on an Android device or use the Android Studio device emulator).
4. Production → Create new release → upload your AAB → write release notes → review → release.

First review takes 3–7 days. After that, updates are usually approved in a few hours.

---

## iOS — App Store release (Mac required)

### Install Xcode
1. Mac App Store → search Xcode → install (8 GB+ download, sorry).
2. Open Xcode once and accept the license. Run `sudo xcodebuild -license accept` if prompted.

### Apple Developer Program enrolment
- Required to publish. **$99/year**.
- Sign up at <https://developer.apple.com/programs>.

### Open the project
```bash
cd "Cuet exam app/cuet-quiz-app"
npx cap open ios
```

In Xcode:

1. Click the **App** target in the left sidebar.
2. **Signing & Capabilities** → check **Automatically manage signing** → pick your Team (your Apple Developer account).
3. Update the **Bundle Identifier** if you want something other than `com.examgrind.app`.

### Archive + upload
1. Top bar → device target → pick "Any iOS Device (arm64)".
2. Product → Archive. Takes a few minutes.
3. The Organizer window opens automatically with your archive. Click **Distribute App** → **App Store Connect** → **Upload**.
4. Wait for processing in <https://appstoreconnect.apple.com>.

### App Store Connect submission
1. <https://appstoreconnect.apple.com> → My Apps → Create new app → bundle ID = the one you used in Xcode.
2. Fill in the listing (description, screenshots, pricing, age rating, etc.).
3. Add the uploaded build → submit for review.

First review takes 1–3 days. Apple is famously picky about wrapped sites; the mitigations in `capacitor.config.ts` (native splash, status bar, etc.) help, but if Apple rejects under guideline 4.2 (Minimum Functionality), the fix is usually to add 1–2 native plugins (push notifications, biometric login, etc.) so the app is more than "just a webview".

---

## Day-to-day workflow

```
Web change → push to GitHub → Vercel deploys → mobile users get it on next launch.

Mobile shell change (splash, icons, plugins, capacitor.config.ts):
  → edit
  → npx cap sync
  → rebuild in Android Studio / Xcode
  → upload new AAB / IPA
  → store re-review (Android usually approves in hours, iOS in 1–2 days)
```

You'll rarely need to rebuild the native shell. Once the app is on the stores, every Vercel deploy reaches users immediately.

---

## Troubleshooting

**"App won't load past the splash screen"**
The WebView can't reach `examgrind.in`. Check that the offline fallback HTML at `public/native-fallback/index.html` renders — it's what's shown in this case. Also confirm `server.allowNavigation` in `capacitor.config.ts` includes every domain the user might hit (Razorpay, Supabase auth, Google OAuth).

**"Razorpay checkout doesn't open in the app"**
Make sure `checkout.razorpay.com` and `api.razorpay.com` are in `allowNavigation`. They already are in the default config. If they get stripped, add them back.

**"Google sign-in says 'app not allowed'"**
Google OAuth needs the Capacitor app's bundle ID / SHA-1 added to the OAuth client in Supabase (Auth → Providers → Google → Authorized domains). Add `com.examgrind.app` and the SHA-1 of your release keystore (`keytool -list -v -keystore ~/examgrind-release.keystore`).

**"Apple rejected as 'just a website'"**
Apple's guideline 4.2 wants apps that "have native functionality". Add either:
- `@capacitor/push-notifications` (5 lines of code, plus Firebase setup) — counts as native.
- `@capacitor/biometric` for Touch ID / Face ID quiz login — counts as native.
Both are 15-min additions and most reviewers approve after one of them ships.
