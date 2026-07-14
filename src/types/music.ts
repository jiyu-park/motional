import type { ActivityType, MoodType } from '@/types/mood';

export type RecommendationDirection = 'stay' | 'refresh';

export type MoodGroup =
  | 'bright'
  | 'flutter'
  | 'calm'
  | 'tired'
  | 'comfort'
  | 'release';

export type IndieTrack = {
  id: string;
  title: string;
  artist: string;
  moods: MoodType[];
  moodGroups: MoodGroup[];
  activities: ActivityType[];
  energy: 1 | 2 | 3 | 4 | 5;
  direction: RecommendationDirection;
  recommendationText: string;
  youtubeUrl?: string;
  youtubeSearchQuery: string;
  icon?: string;
};

export type ScoredIndieTrack = {
  score: number;
  track: IndieTrack;
};
