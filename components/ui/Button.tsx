import { ActivityIndicator, Pressable, Text } from 'react-native';

type ButtonVariant = 'primary' | 'secondary';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      disabled={isDisabled}
      className={`h-14 flex-row items-center justify-center rounded-2xl px-6 ${variantClasses[variant]} ${
        isDisabled ? 'opacity-50' : 'active:opacity-80'
      }`}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text className="font-display text-lg text-white">{label}</Text>
      )}
    </Pressable>
  );
}
