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
        "m3-sys-light-on-primary": "#fff",
        gray: "#1e1e1e",
        lightsalmon: "#ff9c77",
        black: "#000",
        darkorchid: "#7e1cc4",
        mediumpurple: "#b379dd",
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
      base: "1rem",
      "5xl": "1.5rem",
      inherit: "inherit",
    },
  },
};


