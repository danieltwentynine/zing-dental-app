import type { ToothZone } from '@/types';

export const COLORS = {
  primary: '#00C9A7',
  secondary: '#4FC3F7',
  background: '#F8FFFE',
  surface: '#FFFFFF',
  textPrimary: '#0F2027',
  textSecondary: '#64748B',
  warning: '#FFB347',
} as const;

export const BRUSHING_DURATION_SECONDS = 120;
export const COUNTDOWN_SECONDS = 3;

export const ALL_TOOTH_ZONES: ToothZone[] = [
  'top-front',
  'top-left',
  'top-right',
  'top-back-left',
  'top-back-right',
  'bottom-front',
  'bottom-left',
  'bottom-right',
  'bottom-back-left',
  'bottom-back-right',
];

// Used when the Gemini API fails or is rate-limited — never show an error to the child.
export const FALLBACK_COACH_MESSAGES: string[] = [
  'Great brushing today! Your smile is getting stronger every day.',
  'Awesome job! Tomorrow, try to reach all the way to your back teeth.',
  'You did it! Keep brushing every day and your teeth will sparkle.',
];
