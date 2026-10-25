import { Text, View, type ViewStyle } from 'react-native';

import { Sparky } from '@/components/brand/ZingBrand';
import { hardShadow, outline, palette, radius, tokens } from '@/lib/tokens';

interface CoachCardProps {
  message: string;
  score?: number | null;
  title?: string;
  style?: ViewStyle;
}

/**
 * CoachCard — the post-session coaching message from Sparky. Warm, playful,
 * never clinical (CLAUDE.md > Gemini Coach). Optional score chip.
 */
export function CoachCard({ message, score = null, title = 'Sparky says', style }: CoachCardProps) {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          columnGap: 14,
          padding: 18,
          borderRadius: radius['2xl'],
          backgroundColor: tokens.surfaceMint,
          alignItems: 'flex-start',
        },
        hardShadow(6),
        style,
      ]}
    >
      <Sparky width={60} />
      <View style={{ flex: 1, rowGap: 6 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 8 }}>
          <Text className="font-display" style={{ fontSize: 17, color: palette.cobalt[700] }}>
            {title}
          </Text>
          {score != null ? (
            <View
              style={[
                {
                  backgroundColor: tokens.brandPrimary,
                  borderRadius: radius.pill,
                  paddingHorizontal: 10,
                  paddingVertical: 1,
                },
                outline,
              ]}
            >
              <Text className="font-numeric" style={{ fontSize: 14, color: tokens.textOnBrand }}>
                {score}/100
              </Text>
            </View>
          ) : null}
        </View>
        <Text className="font-body" style={{ fontSize: 17, lineHeight: 25, color: tokens.textPrimary }}>
          {message}
        </Text>
      </View>
    </View>
  );
}
