import { Redirect, router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CoachCard } from '@/components/brushing/CoachCard';
import { MouthMap } from '@/components/brushing/MouthMap';
import { Button } from '@/components/ui/Button';
import { tokens } from '@/lib/tokens';
import { useSessionStore } from '@/stores/sessionStore';

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 5 }}>
      <View style={{ width: 11, height: 11, borderRadius: 3, backgroundColor: color }} />
      <Text className="font-bodySemibold" style={{ fontSize: 12, color: tokens.textSecondary }}>
        {label}
      </Text>
    </View>
  );
}

export default function ResultsScreen() {
  const result = useSessionStore((s) => s.lastResult);

  if (!result) {
    return <Redirect href="/(tabs)/home" />;
  }

  const title = result.score >= 80 ? 'Great brushing!' : 'Good effort!';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tokens.surfacePage }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingBottom: 28, paddingTop: 8, alignItems: 'center' }}>
        <Text
          className="font-subhead"
          style={{ fontSize: 14, letterSpacing: 1.1, color: tokens.brandPrimary, marginTop: 6 }}
        >
          SESSION COMPLETE
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginVertical: 4 }}>
          <Text className="font-numeric" style={{ fontSize: 88, color: tokens.textPrimary, lineHeight: 92 }}>
            {result.score}
          </Text>
          <Text className="font-numeric" style={{ fontSize: 34, color: tokens.textTertiary, marginBottom: 10 }}>
            /100
          </Text>
        </View>

        <Text className="font-display" style={{ fontSize: 22, color: tokens.textPrimary }}>
          {title}
        </Text>

        <View style={{ marginTop: 14, marginBottom: 6 }}>
          <MouthMap states={result.zoneStates} size={200} />
        </View>

        <View style={{ flexDirection: 'row', columnGap: 16, marginBottom: 18 }}>
          <LegendDot color={tokens.zoneDone} label="Brushed" />
          <LegendDot color={tokens.zoneMissed} label="Missed" />
        </View>

        <CoachCard score={result.score} message={result.coachMessage} style={{ width: '100%' }} />

        <View style={{ width: '100%', rowGap: 12, marginTop: 'auto', paddingTop: 22 }}>
          <Button label="See my progress" size="lg" onPress={() => router.replace('/(tabs)/progress')} />
          <Button label="Brush again" variant="soft" onPress={() => router.replace('/session')} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
