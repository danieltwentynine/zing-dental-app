import '../global.css';

import {
  Baloo2_500Medium,
  Baloo2_600SemiBold,
  Baloo2_700Bold,
  Baloo2_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/baloo-2';
import { Nunito_800ExtraBold } from '@expo-google-fonts/nunito';
import { SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';

import { auth } from '@/lib/firebase';
import { COLORS } from '@/lib/constants';
import { useAuthStore } from '@/stores/authStore';

export default function RootLayout() {
  const setUser = useAuthStore((state) => state.setUser);

  const [fontsLoaded] = useFonts({
    Baloo2_500Medium,
    Baloo2_600SemiBold,
    Baloo2_700Bold,
    Baloo2_800ExtraBold,
    Nunito_800ExtraBold, // wordmark only (ZingBrand) — UI text uses Baloo 2
    SpaceGrotesk_700Bold,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, [setUser]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.background },
        }}
      />
    </>
  );
}
