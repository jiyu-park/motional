import type { MoodType } from '@/types/mood';
import type { MoodGroup, RecommendationDirection } from '@/types/music';

export const moodGroupByMood: Readonly<Record<MoodType, MoodGroup>> = {
  happy: 'bright',
  pleasure: 'bright',
  excited: 'bright',
  flutter: 'flutter',
  peaceful: 'calm',
  normal: 'calm',
  numb: 'comfort',
  tired: 'tired',
  sleepy: 'tired',
  sad: 'comfort',
  gloom: 'comfort',
  anxiety: 'comfort',
  anger: 'release',
  stress: 'release',
  shock: 'release',
};

export const directionLabels: Readonly<Record<RecommendationDirection, string>> = {
  stay: '머무르기',
  refresh: '환기하기',
};

export const directionDescriptions: Readonly<Record<RecommendationDirection, string>> = {
  stay: '지금 감정의 결을 천천히 이어가요.',
  refresh: '감정을 밀어내지 않고 조금 다른 공기로 이동해요.',
};

export const moodGroupLabels: Readonly<Record<MoodGroup, string>> = {
  bright: '밝고 경쾌한 흐름',
  flutter: '설레는 흐름',
  calm: '차분한 흐름',
  tired: '느슨하게 쉬는 흐름',
  comfort: '다정한 위로의 흐름',
  release: '힘을 풀어내는 흐름',
};

export const energyRangeByMoodGroup: Readonly<Record<MoodGroup, readonly [number, number]>> = {
  bright: [3, 5],
  flutter: [2, 4],
  calm: [1, 3],
  tired: [1, 2],
  comfort: [1, 3],
  release: [3, 5],
};
