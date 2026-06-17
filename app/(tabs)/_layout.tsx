import { Tabs, router } from 'expo-router';
import { ChartLineUp, House, Tooth } from 'phosphor-react-native';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { shadows, tokens } from '@/lib/tokens';

function TabItem({
  label,
  active,
  icon,
  onPress,
}: {
  label: string;
  active: boolean;
  icon: (color: string, weight: 'bold' | 'fill') => React.ReactNode;
  onPress: () => void;
}) {
  const color = active ? tokens.brandPrimary : tokens.textTertiary;
  return (
    <Pressable onPress={onPress} style={{ flex: 1, alignItems: 'center', rowGap: 4 }}>
      {icon(color, active ? 'fill' : 'bold')}
      <Text className="font-bodySemibold" style={{ fontSize: 11, color, fontWeight: '700' }}>
        {label}
      </Text>
    </Pressable>
  );
}

interface TabBarProps {
  state: { index: number; routes: { key: string; name: string }[] };
  navigation: { navigate: (name: string) => void };
}

function ZingTabBar({ state, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const activeRoute = state.routes[state.index]?.name;

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'flex-start',
          paddingTop: 12,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 12,
          height: 76 + (insets.bottom > 0 ? insets.bottom : 12),
          backgroundColor: tokens.surfaceCard,
          borderTopWidth: 1,
          borderTopColor: tokens.borderSubtle,
        },
        shadows.sm,
      ]}
    >
      <TabItem
        label="Home"
        active={activeRoute === 'home'}
        icon={(c, w) => <House size={25} color={c} weight={w} />}
        onPress={() => navigation.navigate('home')}
      />

      <View style={{ flex: 1, alignItems: 'center' }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Start brushing"
          onPress={() => router.push('/session')}
          style={[
            {
              position: 'absolute',
              top: -26,
              width: 66,
              height: 66,
              borderRadius: 33,
              backgroundColor: tokens.brandPrimary,
              borderWidth: 4,
              borderColor: tokens.surfaceCard,
              alignItems: 'center',
              justifyContent: 'center',
            },
            shadows.mint,
          ]}
        >
          <Tooth size={30} color="#fff" weight="fill" />
        </Pressable>
        <Text
          className="font-bodySemibold"
          style={{ position: 'absolute', top: 46, fontSize: 11, color: tokens.brandPrimary, fontWeight: '700' }}
        >
          Brush
        </Text>
      </View>

      <TabItem
        label="Progress"
        active={activeRoute === 'progress'}
        icon={(c, w) => <ChartLineUp size={25} color={c} weight={w} />}
        onPress={() => navigation.navigate('progress')}
      />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <ZingTabBar {...props} />}>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="progress" />
    </Tabs>
  );
}
