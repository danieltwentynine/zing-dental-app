import { type ReactNode, useEffect, useState } from 'react';
import { Text, TextInput, View, type TextInputProps, type ViewStyle } from 'react-native';

import { palette, radius, tokens } from '@/lib/tokens';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: ReactNode;
  containerStyle?: ViewStyle;
}

/**
 * Input — mirrors the app's register-screen field: 56px tall, 16px radius,
 * 1.5px subtle border that turns mint on focus / danger on error.
 */
export function Input({ label, error, icon, containerStyle, onFocus, onBlur, ...rest }: InputProps) {
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    console.log('[Input] MOUNT', label);
    return () => console.log('[Input] UNMOUNT', label);
  }, [label]);

  const borderColor = error
    ? tokens.feedbackDanger
    : focused
    ? tokens.borderFocus
    : tokens.borderSubtle;

  return (
    <View style={[{ rowGap: 6 }, containerStyle]}>
      {label ? (
        <Text className="font-bodySemibold" style={{ fontSize: 14, color: tokens.textPrimary }}>
          {label}
        </Text>
      ) : null}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          columnGap: 10,
          height: 56,
          paddingHorizontal: 16,
          borderRadius: radius.lg,
          backgroundColor: rest.editable === false ? tokens.surfaceSunken : tokens.surfaceCard,
          borderWidth: 1.5,
          borderColor,
          // mint focus ring
          ...(focused && !error
            ? {
                shadowColor: palette.mint[500],
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.18,
                shadowRadius: 5,
                elevation: 2,
              }
            : null),
        }}
      >
        {icon}
        <TextInput
          placeholderTextColor={tokens.textTertiary}
          onFocus={(e) => {
            console.log('[Input] focus', label);
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            console.log('[Input] blur', label);
            setFocused(false);
            onBlur?.(e);
          }}
          style={{
            flex: 1,
            fontFamily: 'Baloo2_500Medium',
            fontSize: 16,
            color: tokens.textPrimary,
            padding: 0,
          }}
          {...rest}
        />
      </View>
      {error ? (
        <Text className="font-body" style={{ fontSize: 14, color: tokens.feedbackDanger }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
