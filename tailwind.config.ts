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
        // Prep Signal — quiet paper base with one deliberate accent per task.
        cream: {
          50:  "#FFFCF6",
          100: "#FCF7EE",
          200: "#F3E8D7",
          300: "#E7D4B6",
        },
        sun: {
          400: "#F8D66A",
          500: "#F5C64D",
          600: "#C99525",
        },
        ember: {
          500: "#ED875F",
          600: "#E7613E",
          700: "#B8462B",
        },
        cocoa: {
          500: "#786B5E",
          700: "#40372F",
          900: "#1D1815",
        },
        moss: {
          500: "#39765A",
        },
        coral: {
          500: "#D6654E", // soft "wrong" — never harsh red
        },
        violet: {
          500: "#8174D9",
          600: "#6659C9",
        },
        indigo: {
          600: "#5C98B9",
        },
      },
      fontFamily: {
        // Display: warm, slightly playful serif
        serif:   ["var(--font-fraunces)", "ui-serif", "Georgia", "serif"],
        // Body: friendly geometric sans
        sans:    ["var(--font-dm-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        // Numbers / counters
        mono:    ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        warm:     "0 1px 0 0 rgba(29, 24, 21, 0.04), 0 10px 28px -12px rgba(29, 24, 21, 0.12)",
        "warm-lg":"0 2px 0 0 rgba(29, 24, 21, 0.04), 0 26px 56px -20px rgba(29, 24, 21, 0.18)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
export default config;
