import type { ReactNode } from 'react';
import { Pressable, Text, type ViewStyle } from 'react-native';

import { motion, radius, shadows, tokens } from '@/lib/tokens';

interface ChipProps {
  label: string;
  selected?: boolean;
  icon?: ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}

/**
 * Chip — a selectable pill (e.g. choosing a child's age).
 * Big tap target (min 44px), mint-fill when selected.
 */
export function Chip({ label, selected = false, icon, onPress, style }: ChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          columnGap: 8,
          minHeight: 44,
          paddingHorizontal: 18,
          borderRadius: radius.pill,
          backgroundColor: selected ? tokens.brandPrimary : tokens.surfaceCard,
          borderWidth: 1.5,
          borderColor: selected ? tokens.brandPrimary : tokens.borderSubtle,
          transform: [{ scale: pressed ? 0.95 : 1 }],
        },
        selected && shadows.mint,
        style,
      ]}
    >
      {icon}
      <Text
        className="font-bodySemibold"
        style={{ color: selected ? tokens.textOnBrand : tokens.textPrimary, fontSize: 15, fontWeight: '700' }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
