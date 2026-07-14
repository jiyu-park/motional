import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
  MOOD_STORAGE_KEY,
  moodPersistStorage,
  type PersistedMoodState,
} from '@/store/mood-storage';
import type { MoodEntry, NewMoodEntry, UpdateMoodEntry } from '@/types/mood';
import { isDateKey } from '@/utils/date';

export interface MoodStoreActions {
  getAllEntries: () => MoodEntry[];
  getEntriesByDate: (date: string) => MoodEntry[];
  getEntryById: (id: string) => MoodEntry | undefined;
  addEntry: (input: NewMoodEntry) => MoodEntry;
  updateEntry: (id: string, input: UpdateMoodEntry) => MoodEntry | undefined;
  deleteEntry: (id: string) => boolean;
  finishHydration: () => void;
}

export interface MoodStoreState extends MoodStoreActions {
  entries: MoodEntry[];
  hasHydrated: boolean;
  isLoading: boolean;
}

function createEntryId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const useMoodStore = create<MoodStoreState>()(
  persist(
    (set, get) => ({
      entries: [],
      hasHydrated: false,
      isLoading: true,
      getAllEntries: () => [...get().entries],
      getEntriesByDate: (date) => {
        if (!isDateKey(date)) return [];
        return get().entries.filter((entry) => entry.date === date);
      },
      getEntryById: (id) => get().entries.find((entry) => entry.id === id),
      addEntry: (input) => {
        if (!isDateKey(input.date)) {
          throw new Error('Mood entry date must use the YYYY-MM-DD format.');
        }

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
      updateEntry: (id, input) => {
        const existingEntry = get().entries.find((entry) => entry.id === id);
        if (!existingEntry) return undefined;
        if (input.date !== undefined && !isDateKey(input.date)) return undefined;

        const updatedEntry: MoodEntry = {
          ...existingEntry,
          activities: input.activities ?? existingEntry.activities,
          date: input.date ?? existingEntry.date,
          mood: input.mood ?? existingEntry.mood,
          note:
            input.note === undefined
              ? existingEntry.note
              : input.note.trim() || undefined,
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.id === id ? updatedEntry : entry,
          ),
        }));
        return updatedEntry;
      },
      deleteEntry: (id) => {
        const entryExists = get().entries.some((entry) => entry.id === id);
        if (!entryExists) return false;

        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id),
        }));
        return true;
      },
      finishHydration: () => set({ hasHydrated: true, isLoading: false }),
    }),
    {
      name: MOOD_STORAGE_KEY,
      storage: moodPersistStorage,
      partialize: (state): PersistedMoodState => ({ entries: state.entries }),
      onRehydrateStorage: () => (state) => state?.finishHydration(),
    },
  ),
);
