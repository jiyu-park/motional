import { theme } from '@/constants/theme';
import type { Activity, Mood } from '@/types/mood';

export const moods: readonly Mood[] = [
  { id: 'happy', label: '행복', emoji: '>ᴗ<', color: theme.colors.mood.happy },
  { id: 'flutter', label: '설렘', emoji: '>_<', color: theme.colors.mood.flutter },
  { id: 'pleasure', label: '즐거움', emoji: '^‿^', color: theme.colors.mood.pleasure },
  { id: 'peaceful', label: '평온', emoji: '˘ᵕ˘', color: theme.colors.mood.peaceful },
  { id: 'normal', label: '보통', emoji: '·_·', color: theme.colors.mood.normal },
  { id: 'tired', label: '피곤', emoji: '´-`', color: theme.colors.mood.tired },
  { id: 'sad', label: '슬픔', emoji: 'ꓶ-ꓶ', color: theme.colors.mood.sad },
  { id: 'anxiety', label: '불안', emoji: '°_°', color: theme.colors.mood.anxiety },
  { id: 'anger', label: '분노', emoji: '●︿●', color: theme.colors.mood.anger },
  { id: 'gloom', label: '우울', emoji: '◞‸◟', color: theme.colors.mood.gloom },
  { id: 'stress', label: '스트레스', emoji: '@_@', color: theme.colors.mood.stress },
  { id: 'sleepy', label: '졸림', emoji: 'Θ_Θ', color: theme.colors.mood.sleepy },
  { id: 'shock', label: '놀람', emoji: '°o°', color: theme.colors.mood.shock },
  { id: 'numb', label: '무감각', emoji: '-_-', color: theme.colors.mood.numb },
  { id: 'excited', label: '신남', emoji: '✧∀✧', color: theme.colors.mood.excited },
];

export const activities: readonly Activity[] = [
  { id: 'exercise', label: '운동', emoji: '🏃' },
  { id: 'work', label: '업무', emoji: '💼' },
  { id: 'study', label: '공부', emoji: '✏️' },
  { id: 'reading', label: '독서', emoji: '📚' },
  { id: 'rest', label: '휴식', emoji: '🫧' },
  { id: 'sleep', label: '수면', emoji: '🌙' },
  { id: 'cafe', label: '카페', emoji: '☕' },
  { id: 'creative', label: '창작', emoji: '🎨' },
  { id: 'social', label: '사교', emoji: '💬' },
  { id: 'other', label: '기타', emoji: '＋' },
];
