import { useState, type ReactNode } from 'react';
import { Pressable, View, type ViewStyle } from 'react-native';

import { hardShadow, outline, palette, radius, tokens } from '@/lib/tokens';

type CardTone = 'plain' | 'soft' | 'sky' | 'sunken' | 'outline' | 'cobalt' | 'sunny' | 'bubblegum';

interface CardProps {
  children: ReactNode;
  tone?: CardTone;
  padding?: number;
  radius?: number;
  interactive?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: ViewStyle;
}

const TONES: Record<CardTone, string> = {
  plain: tokens.surfaceCard,
  soft: tokens.surfaceMint,
  sky: tokens.surfaceSky,
  sunken: tokens.surfaceSunken,
  outline: tokens.surfaceCard,
  cobalt: tokens.brandPrimary,
  sunny: palette.sunny[500],
  bubblegum: palette.bubblegum[500],
};

/**
 * Card — the Toy box surface: 3px ink outline + hard 6px drop (sunken: outline
 * only). The workhorse container for everything: profiles, sessions, stats.
 */
export function Card({
  children,
  tone = 'plain',
  padding = 20,
  radius: radiusProp = radius.xl,
  interactive = false,
  onPress,
  accessibilityLabel,
  style,
}: CardProps) {
  // Pressed state lives in React state because NativeWind's runtime drops
  // Pressable's function-form style prop (nativewind/nativewind#1105).
  const [pressed, setPressed] = useState(false);
  const base: ViewStyle = { borderRadius: radiusProp, padding, backgroundColor: TONES[tone] };
  const flat = tone === 'sunken';

  if (interactive || onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        style={[
          base,
          flat ? outline : hardShadow(pressed ? 3 : 6),
          { transform: [{ scale: pressed ? 0.98 : 1 }, { translateY: pressed ? 3 : 0 }] },
          style,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[base, flat ? outline : hardShadow(6), style]}>{children}</View>;
}
