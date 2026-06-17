import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ZingMascot, ZingWordmark } from '@/components/brand/ZingBrand';
import { Button } from '@/components/ui/Button';
import { tokens } from '@/lib/tokens';

export default function WelcomeScreen() {
  return (
    <LinearGradient
      colors={[tokens.surfaceMint, tokens.surfacePage]}
      locations={[0, 0.7]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1, paddingHorizontal: 28, paddingBottom: 32 }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', rowGap: 6 }}>
          <ZingMascot width={168} />
          <ZingWordmark height={56} />
          <Text
            className="font-bodySemibold"
            style={{
              fontSize: 18,
              lineHeight: 26,
              color: tokens.textSecondary,
              textAlign: 'center',
              maxWidth: 280,
              marginTop: 10,
            }}
          >
            The brushing buddy that turns two minutes into a daily adventure.
          </Text>
        </View>
        <View style={{ rowGap: 12 }}>
          <Button label="Get started" size="lg" onPress={() => router.push('/(auth)/register')} />
          <Button
            label="I already have an account"
            variant="ghost"
            onPress={() => router.push('/(auth)/login')}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
