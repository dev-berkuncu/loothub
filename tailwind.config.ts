import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        steam: {
          dark: "#171a21",
          darker: "#0e141b",
          card: "#1b2838",
          blue: "#66c0f4",
          accent: "#2a475e",
          green: "#a4d007",
          discount: "#4c6b22",
          text: "#c6d4df",
        },
      },
    },
  },
  plugins: [],
};
export default config;
