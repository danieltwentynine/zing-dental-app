import { Fire, type IconProps, LockSimple, Star, Tooth, Trophy } from 'phosphor-react-native';
import type { ComponentType } from 'react';
import { Text, View, type ViewStyle } from 'react-native';

import type { Badge } from '@/types';
import { palette, radius, shadows, tokens } from '@/lib/tokens';

type BadgeType = Badge['type'];

const BADGE_META: Record<BadgeType, { Icon: ComponentType<IconProps>; color: string; label: string }> = {
  streak: { Icon: Fire, color: palette.sunny[500], label: 'On Fire' },
  perfect: { Icon: Star, color: palette.mint[500], label: 'Perfect Brush' },
  firstSession: { Icon: Tooth, color: palette.sky[400], label: 'First Brush' },
  weeklyGoal: { Icon: Trophy, color: palette.grape[500], label: 'Weekly Star' },
};

interface BadgeCardProps {
  type?: BadgeType;
  name?: string;
  earned?: boolean;
  caption?: string;
  style?: ViewStyle;
}

/** BadgeCard — a kid's achievement reward. Earned = full color + glow; locked = greyed. */
export function BadgeCard({ type = 'firstSession', name, earned = true, caption = '', style }: BadgeCardProps) {
  const meta = BADGE_META[type];
  return (
    <View
      style={[
        {
          alignItems: 'center',
          rowGap: 10,
          width: 116,
          paddingVertical: 18,
          paddingHorizontal: 12,
          borderRadius: radius.xl,
          backgroundColor: tokens.surfaceCard,
          borderWidth: earned ? 0 : 1.5,
          borderColor: earned ? undefined : tokens.borderStrong,
          borderStyle: earned ? undefined : 'dashed',
          opacity: earned ? 1 : 0.6,
        },
        earned ? shadows.card : null,
        style,
      ]}
    >
      <View
        style={[
          {
            width: 64,
            height: 64,
            borderRadius: radius.pill,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: earned ? meta.color : palette.ink[100],
          },
          earned ? shadows.sm : null,
        ]}
      >
        {earned ? (
          <meta.Icon size={34} color="#fff" weight="fill" />
        ) : (
          <LockSimple size={34} color={palette.ink[400]} weight="bold" />
        )}
      </View>
      <View style={{ alignItems: 'center', rowGap: 2 }}>
        <Text className="font-display" style={{ fontSize: 14, color: tokens.textPrimary, textAlign: 'center' }}>
          {name ?? meta.label}
        </Text>
        {caption ? (
          <Text className="font-body" style={{ fontSize: 12, color: tokens.textSecondary }}>
            {caption}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
