import { Text, View, type ViewStyle } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { palette, radius, shadows, tokens } from '@/lib/tokens';

/** Compact inline Sparky mascot so CoachCard is self-contained. */
function SparkyMini({ size = 56 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <Path
        d="M50 14C28 14 15 27 15 48c0 16 5 30 11 41 3 6 11 5 14-1l5-17c1-3 6-3 7 0l5 17c3 6 11 7 14 1 6-11 11-25 11-41 0-21-13-34-35-34Z"
        fill="#fff"
        stroke={palette.mint[200]}
        strokeWidth={2.5}
      />
      <Circle cx="38" cy="50" r="5.5" fill={palette.ink[900]} />
      <Circle cx="62" cy="50" r="5.5" fill={palette.ink[900]} />
      <Circle cx="32" cy="62" r="6" fill={palette.coral[500]} opacity={0.5} />
      <Circle cx="68" cy="62" r="6" fill={palette.coral[500]} opacity={0.5} />
      <Path d="M40 63c4 5 16 5 20 0" stroke={palette.ink[900]} strokeWidth={3} strokeLinecap="round" fill="none" />
      <Path d="M78 24l3 8 8 3-8 3-3 8-3-8-8-3 8-3 3-8Z" fill={palette.sunny[500]} />
    </Svg>
  );
}

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
        shadows.card,
        style,
      ]}
    >
      <SparkyMini size={56} />
      <View style={{ flex: 1, rowGap: 6 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 8 }}>
          <Text className="font-display" style={{ fontSize: 15, color: palette.mint[700] }}>
            {title}
          </Text>
          {score != null ? (
            <View
              style={{
                backgroundColor: tokens.brandPrimary,
                borderRadius: radius.pill,
                paddingHorizontal: 10,
                paddingVertical: 2,
              }}
            >
              <Text className="font-numeric" style={{ fontSize: 13, color: '#fff' }}>
                {score}/100
              </Text>
            </View>
          ) : null}
        </View>
        <Text className="font-bodySemibold" style={{ fontSize: 17, lineHeight: 24, color: tokens.textPrimary }}>
          {message}
        </Text>
      </View>
    </View>
  );
}
