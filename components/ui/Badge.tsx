import { Text, View, type ViewStyle } from 'react-native';

import { outline, palette, radius, tokens } from '@/lib/tokens';

type BadgeTone = 'cobalt' | 'warning';

interface BadgeProps {
  label: string;
  tone?: BadgeTone;
  solid?: boolean;
  style?: ViewStyle;
}

// [soft background, solid background, text on solid]. Soft always takes ink text;
// white only on cobalt.
const TONES: Record<BadgeTone, [string, string, string]> = {
  cobalt: [palette.cobalt[100], palette.cobalt[500], tokens.textOnBrand],
  warning: [palette.warning[100], palette.warning[500], tokens.textPrimary],
};

/** Badge — small status / reward pill. */
export function Badge({ label, tone = 'cobalt', solid = false, style }: BadgeProps) {
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
      <Text
        className="font-display-semi"
        style={{ color: solid ? solidFg : tokens.textPrimary, fontSize: 14, lineHeight: 17 }}
      >
        {label}
      </Text>
    </View>
  );
}
