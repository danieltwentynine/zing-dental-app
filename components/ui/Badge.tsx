import type { ReactNode } from 'react';
import { Text, View, type ViewStyle } from 'react-native';

import { palette, radius } from '@/lib/tokens';

type BadgeTone = 'mint' | 'sky' | 'sunny' | 'coral' | 'grape' | 'warning' | 'neutral';

interface BadgeProps {
  label: string;
  tone?: BadgeTone;
  icon?: ReactNode;
  solid?: boolean;
  style?: ViewStyle;
}

// [foreground, soft background, solid background]
const TONES: Record<BadgeTone, [string, string, string]> = {
  mint: [palette.mint[600], palette.mint[100], palette.mint[500]],
  sky: [palette.sky[600], palette.sky[100], palette.sky[400]],
  sunny: ['#9a7b12', palette.sunny[100], palette.sunny[500]],
  coral: ['#b23a47', palette.coral[100], palette.coral[500]],
  grape: ['#5c4fb5', palette.grape[100], palette.grape[500]],
  warning: ['#9a6418', palette.warning[100], palette.warning[500]],
  neutral: [palette.ink[600], palette.ink[100], palette.ink[400]],
};

/** Badge — small status / reward pill. */
export function Badge({ label, tone = 'mint', icon, solid = false, style }: BadgeProps) {
  const [fg, bg, solidBg] = TONES[tone];
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          columnGap: 6,
          height: 26,
          paddingHorizontal: 12,
          borderRadius: radius.pill,
          backgroundColor: solid ? solidBg : bg,
        },
        style,
      ]}
    >
      {icon}
      <Text
        className="font-bodySemibold"
        style={{ color: solid ? '#fff' : fg, fontSize: 13, fontWeight: '700', lineHeight: 14 }}
      >
        {label}
      </Text>
    </View>
  );
}
