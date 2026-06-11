/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#00C9A7',
        secondary: '#4FC3F7',
        background: '#F8FFFE',
        surface: '#FFFFFF',
        ink: '#0F2027',
        muted: '#64748B',
        warning: '#FFB347',
        danger: '#DC2626',
      },
      fontFamily: {
        display: ['Nunito_800ExtraBold'],
        body: ['NunitoSans_400Regular'],
        bodySemibold: ['NunitoSans_600SemiBold'],
        numeric: ['SpaceGrotesk_700Bold'],
      },
    },
  },
  plugins: [],
};
