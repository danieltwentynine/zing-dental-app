import { useState, type ReactNode } from 'react';
import { ActivityIndicator, Pressable, Text, type ViewStyle } from 'react-native';

import { hardShadow, motion, outline, palette, radius, tokens } from '@/lib/tokens';

type ButtonVariant = 'primary' | 'soft' | 'ghost' | 'outline';
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
  style?: ViewStyle;
}

// Controls are 56px; sm still clears the 48px touch-target minimum.
const SIZES: Record<ButtonSize, { height: number; paddingHorizontal: number; font: number }> = {
  sm: { height: 48, paddingHorizontal: 20, font: 16 },
  md: { height: 56, paddingHorizontal: 28, font: 20 },
  lg: { height: 64, paddingHorizontal: 32, font: 22 },
};

// White text only on cobalt (Toy box contrast rule).
const VARIANTS: Record<ButtonVariant, { bg: string; fg: string; toy: boolean }> = {
  primary: { bg: tokens.brandPrimary, fg: tokens.textOnBrand, toy: true },
  soft: { bg: tokens.surfaceMint, fg: palette.cobalt[700], toy: true },
  outline: { bg: tokens.surfaceCard, fg: tokens.textPrimary, toy: true },
  ghost: { bg: 'transparent', fg: palette.cobalt[700], toy: false },
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
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  // Pressed state lives in React state because NativeWind's runtime drops
  // Pressable's function-form style prop (nativewind/nativewind#1105) —
  // style={({ pressed }) => ...} renders completely unstyled here.
  const [pressed, setPressed] = useState(false);
  const s = SIZES[size];
  const v = VARIANTS[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      disabled={isDisabled}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          columnGap: 10,
          height: s.height,
          paddingHorizontal: s.paddingHorizontal,
          borderRadius: radius.pill,
          width: fullWidth ? '100%' : undefined,
          alignSelf: fullWidth ? 'stretch' : undefined,
          backgroundColor: v.bg,
          opacity: isDisabled ? 0.5 : 1,
          transform: [
            { scale: pressed && !isDisabled ? motion.pressScale : 1 },
            { translateY: pressed && !isDisabled ? 2 : 0 },
          ],
        },
        v.toy ? (isDisabled ? outline : hardShadow(pressed ? 3 : 5)) : null,
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
            style={{ color: v.fg, fontSize: s.font, lineHeight: s.font * 1.2 }}
          >
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}
