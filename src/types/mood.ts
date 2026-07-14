export type MoodType =
  | 'happy'
  | 'flutter'
  | 'pleasure'
  | 'peaceful'
  | 'normal'
  | 'tired'
  | 'sad'
  | 'anxiety'
  | 'anger'
  | 'gloom'
  | 'stress'
  | 'sleepy'
  | 'shock'
  | 'numb'
  | 'excited';

export type ActivityType =
  | 'exercise'
  | 'work'
  | 'study'
  | 'reading'
  | 'rest'
  | 'sleep'
  | 'cafe'
  | 'creative'
  | 'social'
  | 'other';

export type Mood = {
  id: MoodType;
  label: string;
  emoji: string;
  color: string;
};

export type Activity = {
  id: ActivityType;
  label: string;
  emoji: string;
};

export type MoodEntry = {
  id: string;
  date: string;
  mood: MoodType;
  activities: ActivityType[];
  note?: string;
  createdAt: string;
  updatedAt: string;
};

export type NewMoodEntry = Pick<MoodEntry, 'date' | 'mood' | 'activities' | 'note'>;
