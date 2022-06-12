/** @type {import('tailwindcss').Config} */
const { colors } = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: colors,
    extend: {
      colors: {
        mainBg: "#15202B",
        hoverBg: "#162D3F",
        hoverGray: "#2C3640",
        mainWhite: "#f7f9f9",
        hoverBlue: "#1a8cd8",
        primaryBlue: "#1d9bf0",
        textGray: "#8b98a5",
        lightGreen: "#00BA7C",
        hoverGreen: "#19363A",
        lightRed: "#F91880",
        hoverRed: "#32253A",
        widgetBg: "#1E2732",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide"), require("tailwind-scrollbar")],
};
