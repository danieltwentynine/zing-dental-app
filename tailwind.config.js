/** @type {import('tailwindcss').Config} */
// Colors, fonts, radii and toy shadows come from tailwind.preset.js (design-system
// export — regenerate, don't hand-edit). Only app aliases live here.
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset'), require('./tailwind.preset')],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#14142b' },
        muted: '#55557a',
        danger: { DEFAULT: '#dc2626' },
      },
    },
  },
  plugins: [],
};
