import type { ReactNode } from 'react';
import { Text, View, type ViewStyle } from 'react-native';

import { outline, palette, radius, tokens } from '@/lib/tokens';

type BadgeTone = 'cobalt' | 'bubblegum' | 'sky' | 'sunny' | 'coral' | 'grape' | 'warning' | 'neutral';

interface BadgeProps {
  label: string;
  tone?: BadgeTone;
  icon?: ReactNode;
  solid?: boolean;
  style?: ViewStyle;
}

// [soft background, solid background, text on solid]. Soft always takes ink text;
// white only on cobalt and bubblegum-600.
const TONES: Record<BadgeTone, [string, string, string]> = {
  cobalt: [palette.cobalt[100], palette.cobalt[500], tokens.textOnBrand],
  bubblegum: [palette.bubblegum[100], palette.bubblegum[600], tokens.textOnBrand],
  sky: [palette.sky[100], palette.sky[400], tokens.textPrimary],
  sunny: [palette.sunny[100], palette.sunny[500], tokens.textPrimary],
  coral: [palette.coral[100], palette.coral[500], tokens.textPrimary],
  grape: [palette.grape[100], palette.grape[500], tokens.textPrimary],
  warning: [palette.warning[100], palette.warning[500], tokens.textPrimary],
  neutral: [palette.ink[100], palette.ink[300], tokens.textPrimary],
};

/** Badge — small status / reward pill. */
export function Badge({ label, tone = 'cobalt', icon, solid = false, style }: BadgeProps) {
  const [bg, solidBg, solidFg] = TONES[tone];
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          columnGap: 6,
          height: 30,
          paddingHorizontal: 12,
          borderRadius: radius.pill,
          backgroundColor: solid ? solidBg : bg,
        },
        outline,
        style,
      ]}
    >
      {icon}
      <Text
        className="font-display-semi"
        style={{ color: solid ? solidFg : tokens.textPrimary, fontSize: 14, lineHeight: 17 }}
      >
        {label}
      </Text>
    </View>
  );
}
