import { type ReactNode, useState } from 'react';
import { Text, TextInput, View, type TextInputProps, type ViewStyle } from 'react-native';

import { font, radius, tokens } from '@/lib/tokens';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: ReactNode;
  containerStyle?: ViewStyle;
}

/**
 * Input — Toy box field: 56px tall, 16px radius, 3px ink outline + hard drop.
 * The outline turns cobalt on focus / danger on error.
 */
export function Input({ label, error, icon, containerStyle, onFocus, onBlur, ...rest }: InputProps) {
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? tokens.feedbackDanger
    : focused
    ? tokens.borderFocus
    : tokens.borderSubtle;

  return (
    <View style={[{ rowGap: 6 }, containerStyle]}>
      {label ? (
        <Text className="font-body-semi" style={{ fontSize: 14, color: tokens.textPrimary }}>
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
          borderWidth: 3,
          borderColor,
          // boxShadow must stay present at all times and only change value.
          // Adding/removing a shadow key on focus makes Fabric recreate the native
          // view, which resigns first responder and instantly blurs the field
          // (facebook/react-native#53440).
          boxShadow: `0 ${focused ? 5 : 3}px 0 ${borderColor}`,
        }}
      >
        {icon}
        <TextInput
          placeholderTextColor={tokens.textTertiary}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={{
            flex: 1,
            fontFamily: font.body,
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
