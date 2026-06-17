import { LinearGradient } from 'expo-linear-gradient';
import { Text, View, type ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { radius, shadows, tokens } from '@/lib/tokens';

function Flame({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2c.6 3.2-1.7 4.6-3 6-1.4 1.5-2.5 3.2-2.5 5.5A5.5 5.5 0 0 0 12 19a5.5 5.5 0 0 0 5.5-5.5c0-1.7-.7-3-1.6-4.2-.5 1-1.3 1.6-2.2 1.7.9-2.4.2-5.6-1.7-9Z"
        fill={tokens.feedbackReward}
      />
      <Path
        d="M12 19a3 3 0 0 1-3-3c0-1.4 1-2.4 1.8-3.3.4 1 1.2 1.5 2.2 1.6-.5 1.4-.1 3.2 1 4.2A3 3 0 0 1 12 19Z"
        fill="#fff"
        opacity={0.55}
      />
    </Svg>
  );
}

interface StreakDisplayProps {
  days?: number;
  best?: number | null;
  layout?: 'chip' | 'card';
  style?: ViewStyle;
}

/** StreakDisplay — the gold flame + day count that drives the daily habit. */
export function StreakDisplay({ days = 0, best = null, layout = 'card', style }: StreakDisplayProps) {
  if (layout === 'chip') {
    return (
      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: 6,
            height: 30,
            paddingLeft: 10,
            paddingRight: 12,
            borderRadius: radius.pill,
            backgroundColor: '#fff3cf',
          },
          style,
        ]}
      >
        <Flame size={18} />
        <Text className="font-numeric" style={{ color: '#9a7b12', fontSize: 15 }}>
          {days}
        </Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#FFF7E0', '#FFEFC2']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          columnGap: 14,
          padding: 18,
          borderRadius: radius.xl,
        },
        shadows.card,
        style,
      ]}
    >
      <View
        style={[
          {
            width: 56,
            height: 56,
            borderRadius: radius.pill,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
          },
          shadows.sunny,
        ]}
      >
        <Flame size={30} />
      </View>
      <View>
        <Text className="font-numeric" style={{ fontSize: 32, color: '#8a6d10', lineHeight: 36 }}>
          {days} {days === 1 ? 'day' : 'days'}
        </Text>
        <Text className="font-bodySemibold" style={{ fontSize: 14, color: '#a9842a' }}>
          {days > 0 ? 'brushing streak' : 'Start your streak today!'}
          {best != null && days > 0 ? `  ·  best ${best}` : ''}
        </Text>
      </View>
    </LinearGradient>
  );
}
