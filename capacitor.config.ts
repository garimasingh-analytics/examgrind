import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Capacitor config for the ExamGrind native wrapper.
 *
 * Strategy: server-URL mode. The native shell (Android + iOS) loads
 * https://examgrind.vercel.app inside a WebView. This keeps the
 * existing SSR + Supabase cookie auth working — we don't have to
 * port the whole Next.js app to a static bundle, and any code we
 * push to Vercel ships to mobile users immediately without a fresh
 * Play Store / App Store submission.
 *
 * Tradeoffs:
 *   + Single codebase, instant updates, full SSR/auth/SEO.
 *   + Same Razorpay Checkout + UPI flow as web (works in WebView).
 *   - Apple's App Store reviewers sometimes call out wrapped sites.
 *     Mitigations baked in: native splash, native StatusBar config,
 *     PWA manifest already in place, and a launch-screen branded as
 *     "ExamGrind" so it feels like a real app on cold start.
 *
 * To build:
 *   $ bash setup-mobile.sh   (one-time scaffolding)
 *   $ npx cap sync           (after any web change)
 *   $ npx cap open android   (opens Android Studio for APK build)
 *   $ npx cap open ios       (opens Xcode for IPA build — Mac only)
 *
 * See MOBILE_SETUP.md for full setup, signing, and store-submission
 * instructions.
 */
const config: CapacitorConfig = {
  appId: "com.examgrind.app",
  appName: "ExamGrind",
  // webDir is required even though we load from a remote URL; it's where
  // the offline fallback HTML lives.
  webDir: "public/native-fallback",
  server: {
    url: "https://examgrind.vercel.app",
    // Cleartext stays false — we only ever serve over HTTPS, which is
    // also what Razorpay Checkout requires.
    cleartext: false,
    // Trust the production hostname so the WebView accepts cookies
    // from the same domain it loaded.
    allowNavigation: [
      "examgrind.vercel.app",
      "*.examgrind.vercel.app",
      // Razorpay Checkout opens checkout.razorpay.com inside the
      // WebView; whitelist it so the user can pay without bouncing
      // out to the system browser.
      "checkout.razorpay.com",
      "api.razorpay.com",
      // Supabase auth redirects pass through these for Google OAuth.
      "rjhewprjimhplrugmifw.supabase.co",
      "accounts.google.com",
      "*.googleusercontent.com",
    ],
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: true,
      backgroundColor: "#FBF5EC", // matches cream-50 from the web palette
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
    },
    StatusBar: {
      // Cream background, dark icons — matches the web header.
      style: "LIGHT",
      backgroundColor: "#FBF5EC",
    },
  },
  android: {
    // Allow the WebView to scroll naturally with content.
    allowMixedContent: false,
  },
  ios: {
    // Lock content under the status bar so it doesn't jump on first paint.
    contentInset: "always",
  },
};

export default config;
