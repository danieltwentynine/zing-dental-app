import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { CheckCircle, Gear, Moon, Play, Sun } from 'phosphor-react-native';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/kids/Avatar';
import { StreakDisplay } from '@/components/kids/StreakDisplay';
import { Card } from '@/components/ui/Card';
import { useActiveChild } from '@/hooks/useActiveChild';
import { palette, radius, shadows, tokens } from '@/lib/tokens';
import { useAuthStore } from '@/stores/authStore';

function SectionTitle({ children }: { children: string }) {
  return (
    <Text className="font-display" style={{ fontSize: 19, color: tokens.textPrimary, marginBottom: 12 }}>
      {children}
    </Text>
  );
}

interface Slot {
  label: string;
  done: boolean;
  time: string;
  Icon: typeof Sun;
}

export default function HomeScreen() {
  const user = useAuthStore((s) => s.user);
  const { child } = useActiveChild();

  const parentName = user?.displayName?.split(' ')[0] ?? 'there';
  const slots: Slot[] = [
    { label: 'Morning', done: true, time: '7:52 AM', Icon: Sun },
    { label: 'Evening', done: false, time: 'Not yet', Icon: Moon },
  ];

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: tokens.surfacePage }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 4, rowGap: 22 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text className="font-bodySemibold" style={{ fontSize: 14, color: tokens.textSecondary }}>
              Good morning,
            </Text>
            <Text className="font-display" style={{ fontSize: 26, color: tokens.textPrimary }}>
              {parentName}
            </Text>
          </View>
          <View
            style={[
              {
                width: 44,
                height: 44,
                borderRadius: radius.pill,
                backgroundColor: tokens.surfaceCard,
                alignItems: 'center',
                justifyContent: 'center',
              },
              shadows.sm,
            ]}
          >
            <Gear size={22} color={tokens.textSecondary} weight="bold" />
          </View>
        </View>

        {/* Active child card */}
        <Card tone="mint" padding={18} radius={radius['2xl']}>
          <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 14 }}>
            <Avatar avatarId={child?.avatarId ?? 'shark'} size={62} />
            <View style={{ flex: 1 }}>
              <Text className="font-display" style={{ fontSize: 20, color: tokens.textPrimary }}>
                {child?.name ?? 'Your child'}
              </Text>
              <Text className="font-bodySemibold" style={{ fontSize: 13, color: tokens.textSecondary }}>
                Age {child?.age ?? '–'}
              </Text>
            </View>
            <StreakDisplay days={child?.streakCurrent ?? 0} layout="chip" />
          </View>
        </Card>

        {/* Today's brushing */}
        <View>
          <SectionTitle>Today's brushing</SectionTitle>
          <View style={{ flexDirection: 'row', columnGap: 12 }}>
            {slots.map((s) => (
              <Card key={s.label} padding={16} style={{ flex: 1, alignItems: 'center' }}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    marginBottom: 8,
                    borderRadius: radius.pill,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: s.done ? tokens.surfaceMint : tokens.surfaceSunken,
                  }}
                >
                  {s.done ? (
                    <CheckCircle size={24} color={tokens.brandPrimary} weight="fill" />
                  ) : (
                    <s.Icon size={24} color={tokens.textTertiary} weight="fill" />
                  )}
                </View>
                <Text className="font-display" style={{ fontSize: 15, color: tokens.textPrimary }}>
                  {s.label}
                </Text>
                <Text
                  className="font-bodySemibold"
                  style={{ fontSize: 12, color: s.done ? palette.mint[600] : tokens.textTertiary }}
                >
                  {s.done ? `Done · ${s.time}` : s.time}
                </Text>
              </Card>
            ))}
          </View>
        </View>

        {/* CTA */}
        <LinearGradient
          colors={['#00D7B2', '#00A98C']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[{ borderRadius: radius['2xl'], padding: 20 }, shadows.mint]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 14 }}>
            <View style={{ flex: 1 }}>
              <Text className="font-display" style={{ fontSize: 20, color: '#fff' }}>
                Time to brush!
              </Text>
              <Text
                className="font-bodySemibold"
                style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', marginTop: 2 }}
              >
                Sparky is ready for your evening session.
              </Text>
            </View>
            <Card
              onPress={() => router.push('/session')}
              padding={0}
              radius={radius.pill}
              style={{
                width: 56,
                height: 56,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fff',
              }}
            >
              <Play size={28} color={tokens.brandPrimary} weight="fill" />
            </Card>
          </View>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
}
