import type { Metadata, Viewport } from "next";
import { Fraunces, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import RegisterSW from "@/components/RegisterSW";
import { ChickVariantProvider } from "@/components/ChickVariantContext";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { asChickVariant } from "@/lib/chicks";
import FeedbackWidget from "@/components/FeedbackWidget";
import MarketingTracking from "@/components/MarketingTracking";
import StudyDock from "@/components/StudyDock";
import NavigationFeedback from "@/components/NavigationFeedback";

// Soft warm serif — used for headlines.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

// Friendly geometric sans — used for body & UI.
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["500", "600", "700"],
  display: "swap",
});

const SITE_DESCRIPTION =
  "Know exactly what to study next. Concept-level diagnosis on every wrong answer — for CUET UG, SSC CGL, and NEET UG aspirants. ₹199/month. No credit card.";
const SITE_TITLE = "ExamGrind — AI-graded practice for CUET, SSC CGL & NEET UG";

export const metadata: Metadata = {
  // Use NEXT_PUBLIC_SITE_URL so OG / Twitter cards have absolute URLs
  // when shared. Falls back to a sane default for local dev.
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://examgrind.in"
  ),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  // openGraph + twitter sections drive how the link looks in WhatsApp,
  // LinkedIn, Twitter, iMessage, etc. app/opengraph-image.tsx provides
  // the 1200×630 image automatically.
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: "ExamGrind",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  applicationName: "ExamGrind",
  // Ownership verification only — this does not load advertising code or
  // collect visitor data. Ads remain gated behind explicit consent.
  other: {
    "google-adsense-account": "ca-pub-2090215060427781",
  },
  // iOS Safari needs these explicit tags to treat the site as a PWA when
  // installed via "Add to Home Screen" — the manifest alone isn't enough.
  appleWebApp: {
    capable: true,
    title: "ExamGrind",
    statusBarStyle: "default",
  },
  // Used by Android Chrome's address bar + tab switcher.
  formatDetection: { telephone: false },
  // Explicit favicon wiring — the app/ convention alone was previously
  // masked by a stale Vercel-branded favicon.ico that shipped with the
  // Next.js starter. Force browsers to load our chick icons.
  icons: {
    icon: [
      { url: "/favicon.ico?v=2", sizes: "any" },
      { url: "/icon.png?v=2", type: "image/png", sizes: "512x512" },
      { url: "/icon-192.png?v=2", type: "image/png", sizes: "192x192" },
      { url: "/favicon-32.png?v=2", type: "image/png", sizes: "32x32" },
    ],
    apple: [
      { url: "/icon-192.png?v=2", sizes: "192x192" },
    ],
    shortcut: "/favicon.ico?v=2",
  },
};

// Theme color + viewport were previously embedded in metadata; Next 14
// wants them in a separate Viewport export.
export const viewport: Viewport = {
  themeColor: "#FD7C29",
  // Allow the user to pinch-zoom on long passages.
  initialScale: 1,
  width: "device-width",
  maximumScale: 5,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Server-side: fetch the signed-in user's selected chick so the
  // provider hydrates without a flash of "classic" first.
  let initialVariant: ReturnType<typeof asChickVariant> = "classic";
  let isSignedIn = false;
  try {
    const supabase = createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      isSignedIn = true;
      const admin = createAdminSupabase();
      const { data: row } = await admin
        .from("users")
        .select("selected_chick")
        .eq("id", user.id)
        .single();
      const sc = (row as { selected_chick?: string | null } | null)?.selected_chick;
      initialVariant = asChickVariant(sc);
    }
  } catch {
    // ignore — fallback to "classic" is fine
  }

  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}>
      <head>
        {/* Native inline script intentionally runs during HTML parsing, before
            Next hydrates or any Google tag is requested. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
              window.gtag('consent', 'default', {
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                analytics_storage: 'denied'
              });
            `,
          }}
        />
        {/* Kept in the document head on every route so AdSense can verify
            this is the publisher's site during review. Actual ad requests
            remain inside AdSlot and only happen after marketing consent. */}
        <script
          id="examgrind-adsense-loader"
          async
          crossOrigin="anonymous"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2090215060427781"
        />
      </head>
      <body className="bg-cream-100 text-cocoa-900 antialiased">
        <NavigationFeedback />
        <ChickVariantProvider initialVariant={initialVariant}>
          <div className="flex min-h-[100svh] flex-col pb-20 md:pb-0">
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </ChickVariantProvider>
        <StudyDock signedIn={isSignedIn} />
        {/* One-shot service worker registration so PWA install becomes */}
        {/* available on Android Chrome / iOS Safari. Skips localhost. */}
        <RegisterSW />
        {/* Floating "Feedback" button — visible on every page except    */}
        {/* strict-mode quiz/mock screens, /admin, and /share/[id]. The  */}
        {/* widget itself decides where to hide based on pathname.       */}
        <FeedbackWidget />
        <MarketingTracking />
      </body>
    </html>
  );
}
