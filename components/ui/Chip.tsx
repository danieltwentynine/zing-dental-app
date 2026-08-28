import { useState, type ReactNode } from 'react';
import { Pressable, Text, type ViewStyle } from 'react-native';

import { motion, radius, shadows, tokens } from '@/lib/tokens';

interface ChipProps {
  label: string;
  selected?: boolean;
  icon?: ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

/**
 * Chip — a selectable pill (e.g. choosing a child's age).
 * Big tap target (min 44px), mint-fill when selected.
 */
export function Chip({
  label,
  selected = false,
  icon,
  onPress,
  style,
  accessibilityLabel,
}: ChipProps) {
  // Pressed state lives in React state because NativeWind's runtime drops
  // Pressable's function-form style prop (nativewind/nativewind#1105) —
  // style={({ pressed }) => ...} renders completely unstyled here.
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected }}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          columnGap: 8,
          minHeight: 44,
          paddingHorizontal: 18,
          borderRadius: radius.pill,
          backgroundColor: selected ? tokens.brandPrimary : tokens.surfaceCard,
          borderWidth: 1.5,
          borderColor: selected ? tokens.brandPrimary : tokens.borderSubtle,
          transform: [{ scale: pressed ? motion.pressScale : 1 }],
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
