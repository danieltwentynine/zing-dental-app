import { create } from 'zustand';

import { recordSession } from '@/lib/children';
import { newSessionId, saveSession } from '@/lib/sessions';
import { nextStreak } from '@/lib/streak';
import { useAuthStore } from '@/stores/authStore';
import { useChildStore } from '@/stores/childStore';
import type { ToothZone } from '@/types';

/** The result of a completed brushing session, passed from session → results. */
export interface SessionResult {
  score: number;
  zoneStates: Partial<Record<ToothZone, 'empty' | 'active' | 'done' | 'missed'>>;
  missed: ToothZone[];
  durationSeconds: number;
  coachMessage: string;
}

export type SaveStatus = 'saving' | 'saved' | 'failed';

interface SessionState {
  lastResult: SessionResult | null;
  saveStatus: SaveStatus;
  saveId: string | null;
  finishedAt: Date | null;
  setLastResult: (result: SessionResult | null) => void;
  /** Save the finished session (and retry it) — safe to call more than once. */
  saveLastResult: () => Promise<void>;
}

// The session doc is idempotent through its stable id, but the child's
// totalSessions is an increment — this keeps a double-tapped retry from
// counting the same session twice.
let inFlight = false;

export const useSessionStore = create<SessionState>((set, get) => ({
  lastResult: null,
  saveStatus: 'saving',
  saveId: null,
  finishedAt: null,
  setLastResult: (lastResult) =>
    set({
      lastResult,
      saveStatus: 'saving',
      saveId: null,
      finishedAt: lastResult ? new Date() : null,
    }),

  saveLastResult: async () => {
    const { lastResult, saveStatus, saveId, finishedAt } = get();
    if (!lastResult || saveStatus === 'saved' || inFlight) return;

    const user = useAuthStore.getState().user;
    const child = useChildStore.getState().activeChild;
    if (!user || !child) {
      // Signed out, or the profile hasn't loaded. Keep the result so "Try again"
      // can still save it once the parent is back, instead of dropping it.
      set({ saveStatus: 'failed' });
      return;
    }

    const id = saveId ?? newSessionId();
    inFlight = true;
    set({ saveId: id, saveStatus: 'saving' });
    try {
      // The moment brushing ended, not the moment this attempt runs — a retry
      // must not move the session to a different day or streak.
      const now = finishedAt ?? new Date();
      const streak = nextStreak(child, now);
      const zones = Object.entries(lastResult.zoneStates);

      const ok = await saveSession({
        id,
        childId: child.id,
        parentUid: user.uid,
        completedAt: now,
        durationSeconds: lastResult.durationSeconds,
        zonesDetected: zones.filter(([, s]) => s === 'done').map(([zone]) => zone as ToothZone),
        zonesCoverage: Object.fromEntries(zones.map(([zone, s]) => [zone, s === 'done' ? 100 : 0])),
        score: lastResult.score,
        coachMessage: lastResult.coachMessage,
        streak,
      });
      set({ saveStatus: ok ? 'saved' : 'failed' });
      if (!ok) return;

      const updated = await recordSession(child, streak, now);
      if (updated) useChildStore.getState().setActiveChild(updated);
    } finally {
      inFlight = false;
    }
  },
}));
