/**
 * Zing design tokens — raw values mirroring the design system's CSS tokens
 * (tokens/colors.css, tokens/effects.css). Use these where NativeWind classes
 * can't reach: SVG fills, native shadow objects, gradient stops, animations.
 *
 * For layout/typography prefer the Tailwind classes (see tailwind.config.js).
 */
import type { ViewStyle } from 'react-native';

export const palette = {
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
  ink: {
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
  white: '#ffffff',
  sunny: { 100: '#fff3cf', 500: '#ffcb3d' },
  coral: { 100: '#ffe1e5', 500: '#ff7a8a' },
  grape: { 100: '#ebe7ff', 500: '#9b8cff' },
  warning: { 100: '#fff1dc', 500: '#ffb347' },
  danger: { 100: '#fde8e8', 500: '#dc2626' },
} as const;

/** Semantic aliases — author UIs against these, not the raw ramps. */
export const tokens = {
  textPrimary: palette.ink[900],
  textSecondary: palette.ink[500],
  textTertiary: palette.ink[400],
  textOnBrand: palette.white,
  textLink: palette.mint[600],

  surfacePage: '#f8fffe',
  surfaceCard: palette.white,
  surfaceSunken: palette.ink[50],
  surfaceMint: '#effdf9',
  surfaceSky: '#eef9fe',

  brandPrimary: palette.mint[500],
  brandPrimaryPress: palette.mint[600],
  brandSecondary: palette.sky[400],
  brandSecondaryPress: palette.sky[500],

  borderSubtle: palette.ink[200],
  borderStrong: palette.ink[300],
  borderFocus: palette.mint[500],

  feedbackWarning: palette.warning[500],
  feedbackDanger: palette.danger[500],
  feedbackSuccess: palette.mint[500],
  feedbackReward: palette.sunny[500],

  // Mouth-map zone states
  zoneEmpty: palette.ink[200],
  zoneActive: palette.mint[300],
  zoneDone: palette.mint[500],
  zoneMissed: palette.warning[500],
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  pill: 999,
} as const;

/**
 * Native shadows — soft, low, brand-tinted, never pure black.
 * RN composes iOS shadow* props + Android elevation.
 */
export const shadows = {
  sm: {
    shadowColor: palette.ink[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  card: {
    shadowColor: palette.ink[900],
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 22,
    elevation: 6,
  },
  mint: {
    shadowColor: palette.mint[500],
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
    elevation: 8,
  },
  sky: {
    shadowColor: palette.sky[400],
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
    elevation: 8,
  },
  sunny: {
    shadowColor: palette.sunny[500],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 7,
  },
} satisfies Record<string, ViewStyle>;

/** Springy, friendly motion. */
export const motion = {
  pressScale: 0.96,
} as const;

