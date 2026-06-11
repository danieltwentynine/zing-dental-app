import '../global.css';

import { Nunito_800ExtraBold, useFonts } from '@expo-google-fonts/nunito';
import {
  NunitoSans_400Regular,
  NunitoSans_600SemiBold,
} from '@expo-google-fonts/nunito-sans';
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
    Nunito_800ExtraBold,
    NunitoSans_400Regular,
    NunitoSans_600SemiBold,
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
