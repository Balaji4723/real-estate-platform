/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "#EFEDE4",
          dark: "#E3E0D2",
        },
        ink: "#23262B",
        navy: {
          DEFAULT: "#16263E",
          light: "#1F3252",
          deep: "#0E1A2C",
        },
        chalk: "#8FB8DA",
        brass: {
          DEFAULT: "#B6883B",
          light: "#C89B52",
        },
        moss: "#3F7D58",
        clay: "#A2462D",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      backgroundImage: {
        "blueprint-grid":
          "linear-gradient(rgba(143,184,218,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(143,184,218,0.16) 1px, transparent 1px)",
        "paper-grid":
          "linear-gradient(rgba(35,38,43,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(35,38,43,0.06) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "28px 28px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: 0, transform: "translateY(14px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        "spin-slow": "spin-slow 6s linear infinite",
      },
    },
  },
  plugins: [],
};
