/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#0A0060",
        secondary: "#F4740D",
        background: "#F8FAFC",
        surface: "#FFFFFF",
      },
    },
  },
  plugins: [],
}
