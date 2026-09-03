import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#f1f0e8',
          deep: '#e7e5da',
        },
        ink: '#10110f',
        muted: '#686a63',
        line: 'rgba(16, 17, 15, 0.16)',
        lime: '#d7ff52',
        orange: '#ff6b3d',
        blue: '#66d6ff',
        violet: '#b69cff',
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
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
        serif: ['Georgia', 'serif'],
      },
      letterSpacing: {
        tighter: '-0.085em',
        tight: '-0.045em',
        mono: '0.1em',
      },
      borderRadius: {
        DEFAULT: '5px',
        brand: '5px',
      },
    },
  },
  plugins: [],
};
export default config;
