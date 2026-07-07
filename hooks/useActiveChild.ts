import { router } from 'expo-router';
import { useEffect, useState } from 'react';

import { fetchActiveChild } from '@/lib/children';
import { useAuthStore } from '@/stores/authStore';
import { useChildStore } from '@/stores/childStore';

/**
 * Resolves the parent's active child: prefers the in-memory store (just created
 * during onboarding), otherwise fetches the first child from Firestore. If the
 * parent has no child yet, sends them to child setup.
 */
export function useActiveChild() {
  const user = useAuthStore((s) => s.user);
  const activeChild = useChildStore((s) => s.activeChild);
  const setActiveChild = useChildStore((s) => s.setActiveChild);
  const [loading, setLoading] = useState(!activeChild);

  useEffect(() => {
    let cancelled = false;
    if (activeChild || !user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    (async () => {
      try {
        const child = await fetchActiveChild(user.uid);
        if (cancelled) return;
        if (child) {
          setActiveChild(child);
        } else {
          router.replace('/onboarding/child-setup');
        }
      } catch {
        // Couldn't load (offline, rules, …) — stay put instead of sending the
        // parent to child setup, which would create a duplicate profile.
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, activeChild, setActiveChild]);

  return { child: activeChild, loading };
}
