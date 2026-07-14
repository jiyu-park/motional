import AsyncStorage from '@react-native-async-storage/async-storage';
import { activities, moods } from '@/data/moods';
import type { MoodEntry } from '@/types/mood';
import { isDateKey, isIsoDateTime } from '@/utils/date';

export const MOOD_STORAGE_KEY = 'motional-mood-entries';
const MOOD_STORAGE_VERSION = 0;

export type PersistedMoodState = {
  entries: MoodEntry[];
};

const moodIds = new Set<string>(moods.map((mood) => mood.id));
const activityIds = new Set<string>(activities.map((activity) => activity.id));

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isMoodEntry(value: unknown): value is MoodEntry {
  if (!isRecord(value)) return false;
  if (typeof value.id !== 'string' || value.id.length === 0) return false;
  if (!isDateKey(value.date)) return false;
  if (typeof value.mood !== 'string' || !moodIds.has(value.mood)) return false;
  if (!Array.isArray(value.activities)) return false;
  if (
    !value.activities.every(
      (activity) => typeof activity === 'string' && activityIds.has(activity),
    )
  ) {
    return false;
  }
  if (value.note !== undefined && typeof value.note !== 'string') return false;
  if (!isIsoDateTime(value.createdAt) || !isIsoDateTime(value.updatedAt)) return false;
  return true;
}

function deduplicateEntries(entries: MoodEntry[]) {
  const latestEntryByDate = new Map<string, MoodEntry>();

  for (const entry of entries) {
    const existingEntry = latestEntryByDate.get(entry.date);
    if (!existingEntry || entry.updatedAt > existingEntry.updatedAt) {
      latestEntryByDate.set(entry.date, entry);
    }
  }

  return [...latestEntryByDate.values()].sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  );
}

function parseStoredState(rawValue: string): PersistedMoodState | null {
  const parsed: unknown = JSON.parse(rawValue);
  if (!isRecord(parsed) || !isRecord(parsed.state)) return null;
  if (!Array.isArray(parsed.state.entries)) return null;
  if (!parsed.state.entries.every(isMoodEntry)) return null;
  if (
    parsed.version !== undefined &&
    parsed.version !== MOOD_STORAGE_VERSION
  ) {
    return null;
  }

  return { entries: deduplicateEntries(parsed.state.entries) };
}

async function removeStoredState(name: string) {
  try {
    await AsyncStorage.removeItem(name);
  } catch {
    // Storage access errors should not prevent the app from starting.
  }
}

export async function loadMoodEntries() {
  try {
    const rawValue = await AsyncStorage.getItem(MOOD_STORAGE_KEY);
    if (rawValue === null) return [];

    const storedState = parseStoredState(rawValue);
    if (storedState) return storedState.entries;

    await removeStoredState(MOOD_STORAGE_KEY);
    return [];
  } catch {
    await removeStoredState(MOOD_STORAGE_KEY);
    return [];
  }
}

export async function saveMoodEntries(entries: MoodEntry[]) {
  await AsyncStorage.setItem(
    MOOD_STORAGE_KEY,
    JSON.stringify({
      state: { entries },
      version: MOOD_STORAGE_VERSION,
    }),
  );
}
