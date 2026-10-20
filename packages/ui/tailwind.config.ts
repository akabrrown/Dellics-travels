import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
    "../../apps/web/app/**/*.{ts,tsx}",
    "../../apps/web/components/**/*.{ts,tsx}",
    "../../apps/mobile/app/**/*.{ts,tsx}",
    "../../apps/mobile/components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        dellicsNavy: "#0A0060",
        dellicsNavyDark: "#030067",
        dellicsOrange: "#F4740D",
        dellicsOrangeTint: "#FBD9BE",
        dellicsWhite: "#FFFFFF",
        dellicsSlate: "#3A3A3A",
        dellicsGreen: "#1E7A34",
        dellicsAmber: "#B5540B"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Poppins", "sans-serif"],
      }
    },
  },
  plugins: [],
};

export default config;
