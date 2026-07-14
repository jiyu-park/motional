import {
  energyRangeByMoodGroup,
  moodGroupByMood,
} from '@/constants/music-recommendation';
import type { MoodEntry } from '@/types/mood';
import type {
  IndieTrack,
  RecommendationDirection,
  ScoredIndieTrack,
} from '@/types/music';
import { toDateKey } from '@/utils/date';

export type MusicRecommendationInput = {
  direction: RecommendationDirection;
  entry: MoodEntry;
  recentlyRecommendedTrackIds?: readonly string[];
  selectedActivities: MoodEntry['activities'];
  tracks: readonly IndieTrack[];
};

export function getRecommendationEntry(
  entries: readonly MoodEntry[],
  todayKey = toDateKey(new Date()),
  preferredEntryId?: string,
) {
  const sortedEntries = [...entries].sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  );
  const preferredEntry = preferredEntryId
    ? sortedEntries.find((entry) => entry.id === preferredEntryId)
    : undefined;

  if (preferredEntry) return preferredEntry;
  return sortedEntries.find((entry) => entry.date === todayKey) ?? sortedEntries[0];
}

export function scoreIndieTrack({
  direction,
  entry,
  recentlyRecommendedTrackIds,
  selectedActivities,
}: MusicRecommendationInput, track: IndieTrack) {
  const moodGroup = moodGroupByMood[entry.mood];
  const [minimumEnergy, maximumEnergy] = energyRangeByMoodGroup[moodGroup];
  let score = 0;

  if (track.moods.includes(entry.mood)) score += 5;
  if (track.moodGroups.includes(moodGroup)) score += 3;

  score += selectedActivities.filter((activity) => track.activities.includes(activity)).length * 2;

  if (track.direction === direction) score += 2;
  if (track.energy >= minimumEnergy && track.energy <= maximumEnergy) score += 1;
  if (recentlyRecommendedTrackIds?.includes(track.id)) score -= 3;

  return score;
}

export function recommendIndieTracks(input: MusicRecommendationInput, limit = 7) {
  const scoredTracks: ScoredIndieTrack[] = input.tracks
    .map((track) => ({ score: scoreIndieTrack(input, track), track }))
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.track.title.localeCompare(b.track.title) ||
        a.track.id.localeCompare(b.track.id),
    );
  const artists = new Set<string>();

  return scoredTracks.filter(({ track }) => {
    const artistKey = track.artist.trim().toLocaleLowerCase();
    if (artists.has(artistKey)) return false;
    artists.add(artistKey);
    return true;
  }).slice(0, limit);
}

export function createYouTubeUrl(track: IndieTrack) {
  return (
    track.youtubeUrl ??
    `https://www.youtube.com/results?search_query=${encodeURIComponent(track.youtubeSearchQuery)}`
  );
}
