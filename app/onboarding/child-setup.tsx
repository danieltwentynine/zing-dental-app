import { Text, View } from 'react-native';

import { SafeScreen } from '@/components/ui/SafeScreen';

// Phase 1, step 3 — child profile setup (name, age, avatar picker) comes next.
export default function ChildSetupScreen() {
  return (
    <SafeScreen>
      <View className="flex-1 items-center justify-center px-8">
        <Text className="font-display text-2xl text-ink">Account created!</Text>
        <Text className="mt-2 text-center font-body text-muted">
          Next up: add your child's profile.
        </Text>
      </View>
    </SafeScreen>
  );
}
