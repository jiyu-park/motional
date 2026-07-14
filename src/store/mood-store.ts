import { create } from 'zustand';

import { loadMoodEntries, saveMoodEntries } from '@/store/mood-storage';
import type { MoodEntry, NewMoodEntry, UpdateMoodEntry } from '@/types/mood';
import { isDateKey } from '@/utils/date';

export interface MoodStoreActions {
  getAllEntries: () => MoodEntry[];
  getEntriesByDate: (date: string) => MoodEntry[];
  getEntryById: (id: string) => MoodEntry | undefined;
  addEntry: (input: NewMoodEntry) => Promise<MoodEntry>;
  updateEntry: (id: string, input: UpdateMoodEntry) => Promise<MoodEntry | undefined>;
  deleteEntry: (id: string) => Promise<boolean>;
  hydrateEntries: () => Promise<void>;
}

export interface MoodStoreState extends MoodStoreActions {
  entries: MoodEntry[];
  hasHydrated: boolean;
  isLoading: boolean;
}

function createEntryId() {
  return `mood-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export const useMoodStore = create<MoodStoreState>()((set, get) => {
  const commitEntries = async (nextEntries: MoodEntry[], previousEntries: MoodEntry[]) => {
    set({ entries: nextEntries });

    try {
      await saveMoodEntries(nextEntries);
    } catch (error) {
      set({ entries: previousEntries });
      throw error;
    }
  };

  return {
    entries: [],
    hasHydrated: false,
    isLoading: true,
    getAllEntries: () => get().entries,
    getEntriesByDate: (date) =>
      isDateKey(date) ? get().entries.filter((entry) => entry.date === date) : [],
    getEntryById: (id) => get().entries.find((entry) => entry.id === id),
    addEntry: async (input) => {
      if (!isDateKey(input.date)) {
        throw new Error('Invalid mood entry date.');
      }

      const previousEntries = get().entries;
      const now = new Date().toISOString();
      const normalizedNote = input.note?.trim() || undefined;
      const entry: MoodEntry = {
        ...input,
        id: createEntryId(),
        note: normalizedNote,
        createdAt: now,
        updatedAt: now,
      };
      const nextEntries = [entry, ...previousEntries];

      await commitEntries(nextEntries, previousEntries);
      return entry;
    },
    updateEntry: async (id, input) => {
      const previousEntries = get().entries;
      const existingEntry = previousEntries.find((entry) => entry.id === id);

      if (!existingEntry) {
        return undefined;
      }

      const targetDate = input.date ?? existingEntry.date;
      if (!isDateKey(targetDate)) {
        throw new Error('Invalid mood entry date.');
      }

      const updatedEntry: MoodEntry = {
        ...existingEntry,
        ...input,
        date: targetDate,
        activities: input.activities ?? existingEntry.activities,
        note:
          input.note === undefined ? existingEntry.note : input.note.trim() || undefined,
        createdAt: existingEntry.createdAt,
        updatedAt: new Date().toISOString(),
      };
      const nextEntries = previousEntries.map((entry) =>
        entry.id === id ? updatedEntry : entry,
      );

      await commitEntries(nextEntries, previousEntries);
      return updatedEntry;
    },
    deleteEntry: async (id) => {
      const previousEntries = get().entries;
      const nextEntries = previousEntries.filter((entry) => entry.id !== id);

      if (nextEntries.length === previousEntries.length) {
        return false;
      }

      await commitEntries(nextEntries, previousEntries);
      return true;
    },
    hydrateEntries: async () => {
      set({ isLoading: true });
      const entries = await loadMoodEntries();
      set({ entries, hasHydrated: true, isLoading: false });
    },
  };
});

void useMoodStore.getState().hydrateEntries();
