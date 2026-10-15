import type { Config } from "tailwindcss";

const config: Config = {
  // 🔥 CRITICAL FIX: Enables class-based dark mode for next-themes
  // इसके बिना dark: classes काम नहीं करेंगी
  darkMode: ["class"],

  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      
      //  WORLD-CLASS UPGRADE: Custom Animations for Premium Toggle
      animation: {
        "rainbow-shift": "rainbow-shift 3s ease infinite",
        "shimmer-sweep": "shimmer-sweep 1.5s linear infinite",
      },
      keyframes: {
        "rainbow-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "shimmer-sweep": {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;