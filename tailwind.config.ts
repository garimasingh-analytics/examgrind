import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm Maxima-inspired palette
        cream: {
          50:  "#FFFDF6",
          100: "#FFF8E8",
          200: "#FBEFD0",
          300: "#F4E0A8",
        },
        sun: {
          // Maxima yellow — also our chick's body
          400: "#FFD668",
          500: "#FDCB40",
          600: "#E5B225",
        },
        ember: {
          // Maxima orange — for level-ups & hero CTAs
          500: "#FD7C29",
          600: "#FD4401",
          700: "#C2350A",
        },
        cocoa: {
          // Warm dark text colors (never pure black)
          500: "#5C4C3F",
          700: "#3A2F26",
          900: "#1F1A14",
        },
        moss: {
          500: "#16A34A", // success
        },
        coral: {
          500: "#E07856", // soft "wrong" — never harsh red
        },
      },
      fontFamily: {
        // Display: warm, slightly playful serif
        serif:   ["var(--font-fraunces)", "ui-serif", "Georgia", "serif"],
        // Body: friendly geometric sans
        sans:    ["var(--font-dm-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        // Numbers / counters
        mono:    ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        warm:     "0 1px 0 0 rgba(31, 26, 20, 0.04), 0 8px 24px -8px rgba(31, 26, 20, 0.10)",
        "warm-lg":"0 2px 0 0 rgba(31, 26, 20, 0.04), 0 24px 48px -16px rgba(31, 26, 20, 0.16)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
export default config;
