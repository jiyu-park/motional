import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { MoodEntry, NewMoodEntry } from '@/types/mood';

type MoodState = {
  entries: MoodEntry[];
  hasHydrated: boolean;
  addEntry: (input: NewMoodEntry) => MoodEntry;
  setHasHydrated: (value: boolean) => void;
};

function createEntryId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const useMoodStore = create<MoodState>()(
  persist(
    (set) => ({
      entries: [],
      hasHydrated: false,
      addEntry: (input) => {
        const now = new Date().toISOString();
        const entry: MoodEntry = {
          ...input,
          id: createEntryId(),
          note: input.note?.trim() || undefined,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ entries: [entry, ...state.entries] }));
        return entry;
      },
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: 'motional-mood-entries',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ entries: state.entries }),
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    },
  ),
);
