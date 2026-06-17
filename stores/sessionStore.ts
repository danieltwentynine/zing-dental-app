import { create } from 'zustand';

import type { ToothZone } from '@/types';

/** The result of a completed brushing session, passed from session → results. */
export interface SessionResult {
  score: number;
  zoneStates: Partial<Record<ToothZone, 'empty' | 'active' | 'done' | 'missed'>>;
  missed: ToothZone[];
  durationSeconds: number;
  coachMessage: string;
}

interface SessionState {
  lastResult: SessionResult | null;
  setLastResult: (result: SessionResult | null) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  lastResult: null,
  setLastResult: (lastResult) => set({ lastResult }),
}));
