import { Text, View, type ViewStyle } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { palette, tokens } from '@/lib/tokens';

interface BrushTimerProps {
  remaining?: number;
  total?: number;
  label?: string;
  size?: number;
  style?: ViewStyle;
}

/**
 * BrushTimer — the 2-minute brushing countdown. A big mint progress ring with
 * Space Grotesk numerals in the center. Purely presentational: pass the
 * remaining seconds; drive it from the session state machine.
 */
export function BrushTimer({ remaining = 120, total = 120, label = '', size = 240, style }: BrushTimerProps) {
  const r = size / 2 - 14;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, 1 - remaining / total));
  const mm = Math.floor(remaining / 60);
  const ss = String(Math.floor(remaining % 60)).padStart(2, '0');
  const half = size / 2;

  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={half} cy={half} r={r} fill="none" stroke={palette.ink[100]} strokeWidth={14} />
        <Circle
          cx={half}
          cy={half}
          r={r}
          fill="none"
          stroke={tokens.brandPrimary}
          strokeWidth={14}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
        />
      </Svg>
      <View style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' }}>
        <Text
          className="font-numeric"
          style={{ fontSize: size * 0.26, color: tokens.textPrimary, lineHeight: size * 0.28, letterSpacing: -1 }}
        >
          {mm}:{ss}
        </Text>
        {label ? (
          <Text className="font-bodySemibold" style={{ fontSize: 14, color: tokens.textSecondary }}>
            {label}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
