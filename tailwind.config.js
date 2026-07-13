/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Brand: Mint (primary) — brushing success, main CTAs
        mint: {
          50: '#e6faf6',
          100: '#c2f3e9',
          200: '#8fe9d8',
          300: '#54dcc2',
          400: '#1fceac',
          500: '#00c9a7',
          600: '#00a98c',
          700: '#00876f',
          800: '#096b59',
          900: '#0c574a',
        },
        // Brand: Sky (secondary) — progress, secondary actions
        sky: {
          50: '#eaf7fe',
          100: '#cdecfd',
          200: '#a3ddfb',
          300: '#71cbf9',
          400: '#4fc3f7',
          500: '#29aeee',
          600: '#1690d2',
          700: '#1372a8',
          800: '#155f88',
          900: '#164e6f',
        },
        // Ink / neutral
        ink: {
          DEFAULT: '#0f2027',
          900: '#0f2027',
          700: '#334155',
          600: '#475569',
          500: '#64748b',
          400: '#94a3b8',
          300: '#cbd5e1',
          200: '#e2e8f0',
          100: '#f1f5f9',
          50: '#f8fafc',
        },
        // Playful accents
        sunny: { 100: '#fff3cf', 500: '#ffcb3d' },
        coral: { 100: '#ffe1e5', 500: '#ff7a8a' },
        grape: { 100: '#ebe7ff', 500: '#9b8cff' },
        // Semantic
        warning: { 100: '#fff1dc', DEFAULT: '#ffb347', 500: '#ffb347' },
        danger: { 100: '#fde8e8', DEFAULT: '#dc2626', 500: '#dc2626' },
        // Surfaces & aliases
        primary: '#00C9A7',
        secondary: '#4FC3F7',
        background: '#F8FFFE',
        surface: '#FFFFFF',
        'surface-mint': '#effdf9',
        'surface-sky': '#eef9fe',
        'surface-sunken': '#f8fafc',
        muted: '#64748B',
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
      },
      fontFamily: {
        // Baloo 2 app-wide (design system font exploration, option 1b):
        // heading 800 / subhead 700 / body 500 / label 600
        display: ['Baloo2_800ExtraBold'],
        subhead: ['Baloo2_700Bold'],
        body: ['Baloo2_500Medium'],
        bodySemibold: ['Baloo2_600SemiBold'],
        numeric: ['SpaceGrotesk_700Bold'],
      },
    },
  },
  plugins: [],
};
