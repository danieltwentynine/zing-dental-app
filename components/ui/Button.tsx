import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, Text, type ViewStyle } from 'react-native';

import { motion, radius, shadows, tokens } from '@/lib/tokens';

type ButtonVariant = 'primary' | 'secondary' | 'soft' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
  style?: ViewStyle;
}

const SIZES: Record<ButtonSize, { height: number; paddingHorizontal: number; font: number; radius: number }> = {
  sm: { height: 44, paddingHorizontal: 18, font: 15, radius: radius.md },
  md: { height: 56, paddingHorizontal: 24, font: 18, radius: radius.lg },
  lg: { height: 64, paddingHorizontal: 32, font: 20, radius: radius.xl },
};

const VARIANTS: Record<ButtonVariant, { bg: string; fg: string; shadow?: ViewStyle; border?: string }> = {
  primary: { bg: tokens.brandPrimary, fg: tokens.textOnBrand, shadow: shadows.mint },
  secondary: { bg: tokens.brandSecondary, fg: tokens.textOnBrand, shadow: shadows.sky },
  soft: { bg: tokens.surfaceMint, fg: '#00876f' },
  ghost: { bg: 'transparent', fg: tokens.brandPrimary },
  outline: { bg: tokens.surfaceCard, fg: tokens.textPrimary, border: tokens.borderSubtle },
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  fullWidth = true,
  loading = false,
  disabled = false,
  icon,
  iconRight,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const s = SIZES[size];
  const v = VARIANTS[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          columnGap: 10,
          height: s.height,
          paddingHorizontal: s.paddingHorizontal,
          borderRadius: s.radius,
          width: fullWidth ? '100%' : undefined,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          backgroundColor: v.bg,
          borderWidth: v.border ? 1.5 : 0,
          borderColor: v.border,
          opacity: isDisabled ? 0.5 : pressed ? 0.9 : 1,
          transform: [{ scale: pressed && !isDisabled ? motion.pressScale : 1 }],
        },
        !pressed && !isDisabled && v.shadow,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.fg} />
      ) : (
        <>
          {icon}
          <Text
            className="font-display"
            style={{ color: v.fg, fontSize: s.font, lineHeight: s.font * 1.1 }}
          >
            {label}
          </Text>
          {iconRight}
        </>
      )}
    </Pressable>
  );
}
