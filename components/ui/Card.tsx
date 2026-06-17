import type { ReactNode } from 'react';
import { Pressable, View, type ViewStyle } from 'react-native';

import { radius, shadows, tokens } from '@/lib/tokens';

type CardTone = 'plain' | 'mint' | 'sky' | 'sunken' | 'outline';

interface CardProps {
  children: ReactNode;
  tone?: CardTone;
  padding?: number;
  radius?: number;
  interactive?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

const TONES: Record<CardTone, { bg: string; border?: string }> = {
  plain: { bg: tokens.surfaceCard },
  mint: { bg: tokens.surfaceMint },
  sky: { bg: tokens.surfaceSky },
  sunken: { bg: tokens.surfaceSunken },
  outline: { bg: tokens.surfaceCard, border: tokens.borderSubtle },
};

/**
 * Card — white, pillowy, soft brand-tinted shadow, no hard border.
 * The workhorse container for everything: profiles, sessions, stats.
 */
export function Card({
  children,
  tone = 'plain',
  padding = 20,
  radius: radiusProp = radius.xl,
  interactive = false,
  onPress,
  style,
}: CardProps) {
  const t = TONES[tone];
  const base: ViewStyle = {
    borderRadius: radiusProp,
    padding,
    backgroundColor: t.bg,
    borderWidth: t.border ? 1.5 : 0,
    borderColor: t.border,
  };
  const elevation = tone === 'sunken' ? undefined : shadows.card;

  if (interactive || onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          base,
          elevation,
          { transform: [{ scale: pressed ? 0.985 : 1 }] },
          style,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[base, elevation, style]}>{children}</View>;
}
