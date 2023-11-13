const forms = require("@tailwindcss/forms");
const typography = require("@tailwindcss/typography");
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [forms, typography],
  theme: {
    extend: {
      colors: {
        white: "#fff",
        almostblack: "#1e1e1e",
        lightsalmon: "#ff9c77",
        black: "#000",
        darkorchid: "#7e1cc4",
        mediumpurple: "#b379dd",
        lightbisque: "#ffe5c4",
        neutralgray: "#AAA",
        m3_on_surface: "#CAC4D0",
      },
      spacing: {},
      fontFamily: {
        "nunito-sans": "'Nunito Sans'",
        fredoka: "Fredoka",
        nunito: "Nunito",
      },
      borderRadius: {
        "81xl": "100px",
      },
    },
    fontSize: {
      sm: "0.8rem",
      base: "1rem",
      xl: "1.25rem",
      "2xl": "1.563rem",
      "3xl": "1.953rem",
      "4xl": "2.441rem",
      "5xl": "3.052rem",
      "6xl": "5rem",
      inherit: "inherit",
      "2xl-rfs": "clamp(1.125rem, 0.8vw + 0.5rem, 1.5rem)",
      "xl-rfs": "clamp(0.875rem, 0.8vw + 0.3rem, 1.125rem)",
      "3xl-rfs": "clamp(1.5rem, 1vw + 0.8rem, 2rem)",
      "base-rfs": "clamp(0.75rem, 0.9vw + 0.1rem, 1rem)",
      "1.5xl-rfs": "clamp(1.125rem, 1vw + 0.2rem, 1.25rem)",
    },
    letterSpacing: {
      rls: "clamp(0.5rem, 0.001vw + 0.5rem, 0.75rem)",
    },
    corePlugins: {
      preflight: false,
    },
    important: "#__next",
  },
};
