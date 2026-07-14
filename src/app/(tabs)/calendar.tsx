import { Link, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton, Card } from '@/components/ui';
import { theme } from '@/constants/theme';
import { activities, moods } from '@/data/moods';
import { useMoodStore } from '@/store/mood-store';

const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

function toDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export default function CalendarScreen() {
  const { saved } = useLocalSearchParams<{ saved?: string }>();
  const entries = useMoodStore((state) => state.entries);
  const hasHydrated = useMoodStore((state) => state.hasHydrated);
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekDay = new Date(year, month, 1).getDay();

  const latestEntryByDate = useMemo(() => {
    const result = new Map<string, (typeof entries)[number]>();
    for (const entry of entries) {
      if (!result.has(entry.date)) result.set(entry.date, entry);
    }
    return result;
  }, [entries]);

  const monthEntries = entries.filter((entry) =>
    entry.date.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`),
  );
  const calendarCells = [
    ...Array.from({ length: firstWeekDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        {saved === '1' && (
          <Card
            accessibilityRole="alert"
            padding="medium"
            style={styles.successBanner}
            variant="highlight">
            <Text style={styles.successText}>감정이 저장되었어요. 캘린더에 반영했습니다.</Text>
          </Card>
        )}

        <View style={styles.monthHeader}>
          <View>
            <Text style={styles.monthTitle}>
              {year}년 {month + 1}월
            </Text>
            <Text style={styles.monthSummary}>{monthEntries.length}개의 감정 기록</Text>
          </View>
          <Link href="/mood" asChild>
            <AppButton accessibilityLabel="새 감정 기록" label="＋ 기록" size="small" />
          </Link>
        </View>

        <Card padding="small" style={styles.calendarCard}>
          <View style={styles.weekRow}>
            {weekDays.map((day) => (
              <Text key={day} style={styles.weekDay}>
                {day}
              </Text>
            ))}
          </View>
          <View style={styles.calendarGrid}>
            {calendarCells.map((day, index) => {
              if (day === null) return <View key={`empty-${index}`} style={styles.dayCell} />;

              const dateKey = toDateKey(year, month, day);
              const entry = latestEntryByDate.get(dateKey);
              const mood = moods.find((item) => item.id === entry?.mood);
              const isToday = day === today.getDate();

              return (
                <View key={dateKey} style={[styles.dayCell, isToday && styles.todayCell]}>
                  <Text style={[styles.dayNumber, isToday && styles.todayNumber]}>{day}</Text>
                  {mood && <Text style={styles.dayMood}>{mood.emoji}</Text>}
                </View>
              );
            })}
          </View>
        </Card>

        <View style={styles.recordsSection}>
          <Text style={styles.sectionTitle}>이번 달 기록</Text>
          {!hasHydrated ? (
            <Text style={styles.emptyText}>기록을 불러오는 중이에요.</Text>
          ) : monthEntries.length === 0 ? (
            <Card padding="xlarge" style={styles.emptyCard} variant="muted">
              <Text style={styles.emptyTitle}>아직 기록이 없어요</Text>
              <Text style={styles.emptyText}>첫 감정을 기록하면 이곳에서 확인할 수 있어요.</Text>
            </Card>
          ) : (
            monthEntries.map((entry) => {
              const mood = moods.find((item) => item.id === entry.mood);
              const activityLabels = entry.activities
                .map((id) => activities.find((activity) => activity.id === id)?.label)
                .filter(Boolean)
                .join(', ');

              return (
                <Card key={entry.id} padding="medium" style={styles.recordCard}>
                  <View style={[styles.recordFace, { backgroundColor: mood?.color ?? theme.colors.surfaceMuted }]}>
                    <Text style={styles.recordEmoji}>{mood?.emoji ?? '·_·'}</Text>
                  </View>
                  <View style={styles.recordContent}>
                    <Text style={styles.recordTitle}>
                      {mood?.label ?? entry.mood} · {entry.date}
                    </Text>
                    {activityLabels ? (
                      <Text style={styles.recordMeta}>{activityLabels}</Text>
                    ) : null}
                    {entry.note?.trim() ? (
                      <Text numberOfLines={2} style={styles.recordNote}>
                        {entry.note}
                      </Text>
                    ) : null}
                  </View>
                </Card>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: theme.colors.background, flex: 1 },
  content: { gap: theme.spacing.xl, padding: theme.spacing.xl, paddingBottom: 110 },
  successBanner: {
    borderRadius: theme.radius.md,
  },
  successText: {
    color: theme.colors.successText,
    fontSize: theme.fontSize.bodySmall,
    fontWeight: '800',
    textAlign: 'center',
  },
  monthHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  monthTitle: { color: theme.colors.text, fontSize: theme.fontSize.headline, fontWeight: '800' },
  monthSummary: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.label,
    marginTop: theme.spacing.xs,
  },
  calendarCard: {
    overflow: 'hidden',
  },
  weekRow: { flexDirection: 'row' },
  weekDay: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.labelSmall,
    fontWeight: '800',
    paddingVertical: theme.spacing.sm,
    textAlign: 'center',
    width: '14.2857%',
  },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: {
    alignItems: 'center',
    borderRadius: theme.radius.md,
    height: 58,
    justifyContent: 'center',
    width: '14.2857%',
  },
  todayCell: { backgroundColor: theme.colors.primarySoft },
  dayNumber: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.labelSmall,
    fontWeight: '700',
  },
  todayNumber: { color: theme.colors.primary, fontWeight: '900' },
  dayMood: {
    color: theme.colors.text,
    fontSize: theme.fontSize.label,
    fontWeight: '800',
    marginTop: theme.spacing.xxs,
  },
  recordsSection: { gap: theme.spacing.md },
  sectionTitle: { color: theme.colors.text, fontSize: theme.fontSize.title, fontWeight: '800' },
  emptyCard: {
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  emptyTitle: { color: theme.colors.text, fontSize: theme.fontSize.subtitle, fontWeight: '800' },
  emptyText: { color: theme.colors.textMuted, fontSize: theme.fontSize.bodySmall, textAlign: 'center' },
  recordCard: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  recordFace: {
    alignItems: 'center',
    borderRadius: theme.radius.pill,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  recordEmoji: { color: theme.colors.text, fontSize: theme.fontSize.bodySmall, fontWeight: '800' },
  recordContent: { flex: 1, gap: theme.spacing.xxs },
  recordTitle: { color: theme.colors.text, fontSize: theme.fontSize.body, fontWeight: '800' },
  recordMeta: { color: theme.colors.primary, fontSize: theme.fontSize.labelSmall, fontWeight: '700' },
  recordNote: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.label,
    lineHeight: theme.lineHeight.compact,
  },
});
