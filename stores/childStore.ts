import { create } from 'zustand';

import type { ChildProfile } from '@/types';

interface ChildState {
  activeChild: ChildProfile | null;
  setActiveChild: (child: ChildProfile | null) => void;
}

export const useChildStore = create<ChildState>((set) => ({
  activeChild: null,
  setActiveChild: (activeChild) => set({ activeChild }),
}));
