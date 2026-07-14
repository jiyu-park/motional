export type MoodEntry = {
  id: string;
  date: string;
  mood: string;
  activities: string[];
  note?: string;
  createdAt: string;
  updatedAt: string;
};

export type NewMoodEntry = Pick<MoodEntry, 'date' | 'mood' | 'activities' | 'note'>;
