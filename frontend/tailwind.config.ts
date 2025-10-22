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
        primary: {
          DEFAULT: "#00A86B", // Rich green
          dark: "#008854",
          light: "#00C87F",
        },
        accent: {
          DEFAULT: "#FFD700", // Gold
          dark: "#E6C200",
          light: "#FFED4E",
        },
        background: {
          DEFAULT: "#121212", // Deep gray
          dark: "#0A0A0A",
          card: "#1A1A1A",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["Montserrat", "var(--font-inter)", "sans-serif"],
      },
    },
  },
};

export default config;
