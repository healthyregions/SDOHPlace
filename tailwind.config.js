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
      screens: {
        'l': '1440px',
        'xl': '1680px',
        '2xl': '1920px',
        '3xl': '2560px',
      },
      colors: {
        white: "#fff",
        // lightgray used to be called ms_on_surface (a mui holdover)
        lightgray: "#CAC4D0",
        neutralgray: "#AAA",
        darkgray: "#79747e",
        smokegray: "#343434",
        almostblack: "#1e1e1e",
        black: "#000",
        salmonpink: "#ff9c77",
        frenchviolet: "#7e1cc4",
        lightviolet: "#ECE6F0",
        lightbisque: "#ffe5c4",
        strongorange: "#FF9C77",
      },
      spacing: {},
      flexGrow: {
        1: 1,
        2: 2,
      },
      fontFamily: {
        // sans is the default font applied by tailwind, so alias
        // it to our custom font
        sans: "Nunito",
        // reset serif and mono fonts
        serif: "serif",
        mono: "mono",
        // apply font-fredoka to all h* elements
        fredoka: "Fredoka",
      },
      borderRadius: {
        "81xl": "100px",
      },
    },
    fontSize: {
      sm: "0.8rem",
      s: "0.875rem",
      base: "1rem",
      l: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.563rem",
      "3xl": "1.953rem",
      "4xl": "2.441rem",
      "5xl": "3.052rem",
      "6xl": "5rem",
      4: "4rem",
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
