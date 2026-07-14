import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActivityChip } from '@/components/activity-chip';
import { MoodOption } from '@/components/mood-option';
import { AppButton } from '@/components/ui';
import { theme } from '@/constants/theme';
import { activities, moods } from '@/data/moods';
import { useMoodStore } from '@/store/mood-store';
import type { ActivityType, MoodEntry, MoodType } from '@/types/mood';
import { isDateKey, toDateKey } from '@/utils/date';

const NOTE_LIMIT = 500;

export default function MoodEntryScreen() {
  const { date, entryId } = useLocalSearchParams<{ date?: string; entryId?: string }>();
  const entries = useMoodStore((state) => state.entries);
  const isLoading = useMoodStore((state) => state.isLoading);
  const todayKey = useMemo(() => toDateKey(new Date()), []);
  const requestedDate = date && isDateKey(date) ? date : todayKey;
  const existingEntry = entryId
    ? entries.find((entry) => entry.id === entryId)
    : entries.find((entry) => entry.date === requestedDate);
  const targetDate = existingEntry?.date ?? requestedDate;
  const formKey = existingEntry ? `entry:${existingEntry.id}` : `new:${targetDate}`;

  if (isLoading) {
    return (
      <SafeAreaView edges={['bottom']} style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text style={styles.description}>감정 기록을 불러오는 중이에요.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return <MoodEntryForm key={formKey} existingEntry={existingEntry} targetDate={targetDate} />;
}

type MoodEntryFormProps = {
  existingEntry?: MoodEntry;
  targetDate: string;
};

function MoodEntryForm({ existingEntry, targetDate }: MoodEntryFormProps) {
  const router = useRouter();
  const addEntry = useMoodStore((state) => state.addEntry);
  const updateEntry = useMoodStore((state) => state.updateEntry);
  const deleteEntry = useMoodStore((state) => state.deleteEntry);
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(
    existingEntry?.mood ?? null,
  );
  const [selectedActivities, setSelectedActivities] = useState<ActivityType[]>(
    existingEntry ? [...existingEntry.activities] : [],
  );
  const [note, setNote] = useState(existingEntry?.note ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);

  const toggleActivity = (activityId: ActivityType) => {
    setSelectedActivities((current) =>
      current.includes(activityId)
        ? current.filter((id) => id !== activityId)
        : [...current, activityId],
    );
  };

  const moveToCalendar = (result: 'saved' | 'deleted') => {
    router.replace({
      pathname: '/calendar',
      params: { [result]: '1', selectedDate: targetDate },
    });
  };

  const saveEntry = async () => {
    if (!selectedMood) {
      Alert.alert('감정을 선택해 주세요', '현재 느끼는 감정 하나를 먼저 선택해 주세요.');
      return;
    }
    if (submittingRef.current) return;

    submittingRef.current = true;
    setIsSubmitting(true);
    try {
      const input = {
        activities: selectedActivities,
        date: targetDate,
        mood: selectedMood,
        note,
      };

      if (existingEntry) {
        const updatedEntry = await updateEntry(existingEntry.id, input);
        if (!updatedEntry) throw new Error('Mood entry not found.');
      } else {
        await addEntry(input);
      }

      moveToCalendar('saved');
    } catch {
      Alert.alert('저장하지 못했어요', '잠시 후 다시 시도해 주세요.');
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const deleteCurrentEntry = async () => {
    if (!existingEntry || submittingRef.current) return;

    submittingRef.current = true;
    setIsSubmitting(true);
    try {
      const deleted = await deleteEntry(existingEntry.id);
      if (!deleted) throw new Error('Mood entry not found.');
      moveToCalendar('deleted');
    } catch {
      Alert.alert('삭제하지 못했어요', '잠시 후 다시 시도해 주세요.');
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const confirmDelete = () => {
    Alert.alert('기록을 삭제할까요?', '삭제한 감정 기록은 되돌릴 수 없어요.', [
      { text: '취소', style: 'cancel' },
      { text: '삭제', style: 'destructive', onPress: () => void deleteCurrentEntry() },
    ]);
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <Stack.Screen options={{ title: existingEntry ? '감정 기록 수정' : '감정 기록' }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.heading}>
            <Text style={styles.title}>
              {existingEntry ? '이날의 감정을 수정할까요?' : '지금 기분이 어때요?'}
            </Text>
            <Text style={styles.description}>
              {targetDate} · 가장 가까운 감정 하나를 골라 주세요
            </Text>
          </View>

          <View accessibilityRole="radiogroup" style={styles.moodGrid}>
            {moods.map((mood) => (
              <MoodOption
                key={mood.id}
                mood={mood}
                onPress={() => setSelectedMood(mood.id)}
                selected={selectedMood === mood.id}
              />
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>무엇을 하고 있었나요?</Text>
            <Text style={styles.sectionHint}>여러 개 선택할 수 있어요</Text>
            <View style={styles.chipList}>
              {activities.map((activity) => (
                <ActivityChip
                  key={activity.id}
                  emoji={activity.emoji}
                  label={activity.label}
                  onPress={() => toggleActivity(activity.id)}
                  selected={selectedActivities.includes(activity.id)}
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.noteHeader}>
              <Text style={styles.sectionTitle}>메모</Text>
              <Text style={styles.counter}>
                {note.length}/{NOTE_LIMIT}
              </Text>
            </View>
            <TextInput
              accessibilityLabel="감정 메모"
              maxLength={NOTE_LIMIT}
              multiline
              onChangeText={setNote}
              placeholder="오늘의 순간을 자유롭게 적어 보세요. (선택)"
              placeholderTextColor={theme.colors.textMuted}
              style={styles.input}
              textAlignVertical="top"
              value={note}
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          {!selectedMood && (
            <Text style={styles.validation}>감정을 선택하면 저장할 수 있어요</Text>
          )}
          <AppButton
            disabled={!selectedMood || isSubmitting}
            label={isSubmitting ? '처리 중...' : existingEntry ? '수정 저장' : '감정 저장'}
            onPress={() => void saveEntry()}
          />
          {existingEntry && (
            <Pressable
              accessibilityRole="button"
              disabled={isSubmitting}
              onPress={confirmDelete}
              style={styles.deleteButton}>
              <Text style={styles.deleteLabel}>기록 삭제</Text>
            </Pressable>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { backgroundColor: theme.colors.background, flex: 1 },
  loadingContainer: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  content: { gap: theme.spacing.xxxl, padding: theme.spacing.xl, paddingBottom: 180 },
  heading: { alignItems: 'center', gap: theme.spacing.sm },
  title: { color: theme.colors.text, fontSize: theme.fontSize.headline, fontWeight: '800' },
  description: { color: theme.colors.textMuted, fontSize: theme.fontSize.body },
  moodGrid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: theme.spacing.lg },
  section: { gap: theme.spacing.md },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: theme.fontSize.titleMedium,
    fontWeight: '800',
  },
  sectionHint: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.label,
    marginTop: -theme.spacing.sm,
  },
  chipList: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  noteHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  counter: { color: theme.colors.textMuted, fontSize: theme.fontSize.labelSmall, fontWeight: '700' },
  input: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    color: theme.colors.text,
    fontSize: theme.fontSize.body,
    lineHeight: theme.lineHeight.body,
    minHeight: 132,
    padding: theme.spacing.xl,
  },
  footer: {
    backgroundColor: theme.colors.background,
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
    bottom: 0,
    gap: theme.spacing.sm,
    left: 0,
    padding: theme.spacing.xl,
    position: 'absolute',
    right: 0,
  },
  validation: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.labelSmall,
    textAlign: 'center',
  },
  deleteButton: {
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  deleteLabel: {
    color: theme.colors.danger,
    fontSize: theme.fontSize.bodySmall,
    fontWeight: '800',
  },
});
