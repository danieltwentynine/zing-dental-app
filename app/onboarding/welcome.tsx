import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ZingMascot, ZingWordmark } from '@/components/brand/ZingBrand';
import { Button } from '@/components/ui/Button';
import { tokens } from '@/lib/tokens';

/** Sparky drifts gently up and down so the welcome screen feels alive. */
function FloatingMascot({ width }: { width: number }) {
  const reduceMotion = useReducedMotion();
  const float = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) return;
    float.value = withRepeat(
      withTiming(1, { duration: 1700, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    return () => cancelAnimation(float);
  }, [float, reduceMotion]);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: float.value * -9 }],
  }));

  return (
    <Animated.View style={floatStyle}>
      <ZingMascot width={width} />
    </Animated.View>
  );
}

export default function WelcomeScreen() {
  return (
    <LinearGradient
      colors={[tokens.surfaceMint, tokens.surfacePage]}
      locations={[0, 0.7]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1, paddingHorizontal: 28, paddingBottom: 32 }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', rowGap: 6 }}>
          <FloatingMascot width={168} />
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
        <View style={{ rowGap: 12, marginTop: 24 }}>
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
