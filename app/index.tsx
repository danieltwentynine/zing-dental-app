import { Redirect } from 'expo-router';

import { useAuthStore } from '@/stores/authStore';

export default function Index() {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return null;
  }

  return <Redirect href={user ? '/onboarding/child-setup' : '/(auth)/register'} />;
}
