import { Link } from 'expo-router';
import { Text, View } from 'react-native';

import { SafeScreen } from '@/components/ui/SafeScreen';

// Phase 1, step 2 — full login form comes next.
export default function LoginScreen() {
  return (
    <SafeScreen>
      <View className="flex-1 items-center justify-center px-8">
        <Text className="font-display text-2xl text-ink">Welcome back</Text>
        <Text className="mt-2 text-center font-body text-muted">
          Login is coming in the next step.
        </Text>
        <Link href="/(auth)/register" className="mt-6 font-bodySemibold text-primary">
          Create an account
        </Link>
      </View>
    </SafeScreen>
  );
}
