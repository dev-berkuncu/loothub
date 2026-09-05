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
        parchment: '#e5e4e0',
        ink: '#1d1d1d',
        paper: '#ffffff',
        ash: '#bfbebe',
        stone: '#cdcdc9',
        iridescent: '#facb00',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      fontSize: {
        caption: ['11px', { lineHeight: '1.4', letterSpacing: '0.55px' }],
        'body-sm': ['15px', { lineHeight: '1.4', letterSpacing: '0.15px' }],
        body: ['18px', { lineHeight: '1.4', letterSpacing: '0.23px' }],
        subheading: ['34px', { lineHeight: '1.0', letterSpacing: '0.44px' }],
        'heading-sm': ['46px', { lineHeight: '1.0', letterSpacing: '0.6px' }],
        heading: ['70px', { lineHeight: '0.80', letterSpacing: '0.91px' }],
        'heading-lg': ['76px', { lineHeight: '0.80', letterSpacing: '0.99px' }],
        display: ['103px', { lineHeight: '0.80', letterSpacing: '1.34px' }],
      },
      spacing: {
        '5': '5px',
        '6': '6px',
        '8': '8px',
        '15': '15px',
        '19': '19px',
        '30': '30px',
        '32': '32px',
        '46': '46px',
        '76': '76px',
        '119': '119px',
      },
      borderRadius: {
        cards: '0px',
        links: '10px',
        inputs: '10px',
        buttons: '10px',
      },
    },
  },
  plugins: [],
};
export default config;
