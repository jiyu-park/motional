import { Link, useLocalSearchParams } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton, Card } from '@/components/ui';
import { theme } from '@/constants/theme';
import { activities, moods } from '@/data/moods';
import { useMoodStore } from '@/store/mood-store';
import {
  formatDateTimeLabel,
  getTimeOfDayEmoji,
  isDateKey,
  toDateKey,
  toDateKeyFromParts,
} from '@/utils/date';

const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
const recordRanges = [
  { id: 'month', label: '이번 달 기록' },
  { id: 'today', label: '오늘 기록' },
] as const;

type RecordRange = (typeof recordRanges)[number]['id'];

export default function CalendarScreen() {
  const { saved, selectedDate } = useLocalSearchParams<{
    saved?: string;
    selectedDate?: string;
  }>();
  const entries = useMoodStore((state) => state.entries);
  const isLoading = useMoodStore((state) => state.isLoading);
  const deleteEntry = useMoodStore((state) => state.deleteEntry);
  const [recordRange, setRecordRange] = useState<RecordRange>('month');
  const [deletingEntryId, setDeletingEntryId] = useState<string | null>(null);
  const [pendingDeleteEntry, setPendingDeleteEntry] = useState<{
    date: string;
    id: string;
  } | null>(null);
  const deletingEntryIdRef = useRef<string | null>(null);
  const today = new Date();
  const todayKey = toDateKey(today);
  const activeSelectedDate = selectedDate && isDateKey(selectedDate) ? selectedDate : undefined;
  const selectedDateParts = activeSelectedDate?.split('-').map(Number);
  const year = selectedDateParts?.[0] ?? today.getFullYear();
  const month = selectedDateParts ? selectedDateParts[1] - 1 : today.getMonth();
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
  const visibleEntries =
    recordRange === 'today'
      ? monthEntries.filter((entry) => entry.date === todayKey)
      : monthEntries;
  const calendarCells = [
    ...Array.from({ length: firstWeekDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  const deleteMoodEntry = async (entryId: string) => {
    if (deletingEntryIdRef.current) return;

    deletingEntryIdRef.current = entryId;
    setDeletingEntryId(entryId);
    try {
      const deletedEntry = await deleteEntry(entryId);
      if (!deletedEntry) throw new Error('Mood entry not found.');
    } catch {
      Alert.alert('삭제하지 못했어요', '잠시 후 다시 시도해 주세요.');
    } finally {
      deletingEntryIdRef.current = null;
      setDeletingEntryId(null);
    }
  };

  const confirmDelete = (entryId: string, date: string) => {
    setPendingDeleteEntry({ date, id: entryId });
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <Modal
        animationType="fade"
        onRequestClose={() => setPendingDeleteEntry(null)}
        transparent
        visible={pendingDeleteEntry !== null}>
        <View style={styles.modalOverlay}>
          <View accessibilityRole="alert" style={styles.confirmDialog}>
            <Text style={styles.confirmTitle}>기록을 삭제할까요?</Text>
            <Text style={styles.confirmDescription}>
              {pendingDeleteEntry?.date} 감정 기록은 삭제 후 되돌릴 수 없어요.
            </Text>
            <View style={styles.confirmActions}>
              <AppButton
                label="취소"
                onPress={() => setPendingDeleteEntry(null)}
                style={styles.confirmButton}
                variant="soft"
              />
              <AppButton
                label="삭제"
                onPress={() => {
                  const entryId = pendingDeleteEntry?.id;
                  setPendingDeleteEntry(null);
                  if (entryId) void deleteMoodEntry(entryId);
                }}
                style={styles.confirmButton}
              />
            </View>
          </View>
        </View>
      </Modal>
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
          <Link href={{ pathname: '/mood', params: { date: todayKey } }} asChild>
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

              const dateKey = toDateKeyFromParts(year, month, day);
              const entry = latestEntryByDate.get(dateKey);
              const mood = moods.find((item) => item.id === entry?.mood);
              const isToday = dateKey === todayKey;
              const isSelected = dateKey === activeSelectedDate;

              return (
                <Link
                  key={dateKey}
                  href={{ pathname: '/mood', params: { date: dateKey } }}
                  asChild>
                  <Pressable
                    accessibilityLabel={`${dateKey} 감정 기록`}
                    style={StyleSheet.flatten([
                      styles.dayCell,
                      isToday ? styles.todayCell : undefined,
                      isSelected ? styles.selectedDayCell : undefined,
                    ])}>
                    <Text style={[styles.dayNumber, isToday && styles.todayNumber]}>{day}</Text>
                    {mood && <Text style={styles.dayMood}>{mood.emoji}</Text>}
                  </Pressable>
                </Link>
              );
            })}
          </View>
        </Card>

        <View style={styles.recordsSection}>
          <View style={styles.recordTabs}>
            {recordRanges.map((range) => {
              const selected = recordRange === range.id;
              return (
                <Pressable
                  accessibilityRole="tab"
                  accessibilityState={{ selected }}
                  key={range.id}
                  onPress={() => setRecordRange(range.id)}
                  style={[styles.recordTab, selected && styles.recordTabSelected]}>
                  <Text
                    style={[
                      styles.recordTabLabel,
                      selected && styles.recordTabLabelSelected,
                    ]}>
                    {range.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {isLoading ? (
            <Text style={styles.emptyText}>기록을 불러오는 중이에요.</Text>
          ) : visibleEntries.length === 0 ? (
            <Card padding="xlarge" style={styles.emptyCard} variant="muted">
              <Text style={styles.emptyTitle}>
                {recordRange === 'today' ? '오늘 기록이 없어요' : '아직 기록이 없어요'}
              </Text>
              <Text style={styles.emptyText}>
                {recordRange === 'today'
                  ? '오늘의 첫 감정을 기록해 보세요.'
                  : '첫 감정을 기록하면 이곳에서 확인할 수 있어요.'}
              </Text>
            </Card>
          ) : (
            visibleEntries.map((entry) => {
              const mood = moods.find((item) => item.id === entry.mood);
              const activityLabels = entry.activities
                .map((id) => activities.find((activity) => activity.id === id)?.label)
                .filter(Boolean)
                .join(', ');

              return (
                <Card key={entry.id} padding="medium" style={styles.recordCard}>
                  <Link
                    href={{ pathname: '/mood', params: { date: entry.date, entryId: entry.id } }}
                    asChild>
                    <Pressable
                      accessibilityLabel={`${entry.date} 감정 기록 수정`}
                      style={styles.recordMain}>
                      <View
                        style={[
                          styles.recordFace,
                          { backgroundColor: mood?.color ?? theme.colors.surfaceMuted },
                        ]}>
                        <Text style={styles.recordEmoji}>{mood?.emoji ?? '·_·'}</Text>
                      </View>
                      <View style={styles.recordContent}>
                        <Text style={styles.recordTitle}>
                          {mood?.label ?? entry.mood} · {getTimeOfDayEmoji(entry.createdAt)}{' '}
                          {formatDateTimeLabel(entry.date, entry.createdAt)}
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
                    </Pressable>
                  </Link>
                  <View style={styles.recordActions}>
                    <Link
                      href={{
                        pathname: '/mood',
                        params: { date: entry.date, entryId: entry.id },
                      }}
                      asChild>
                      <Pressable
                        accessibilityLabel={`${entry.date} 감정 기록 수정`}
                        accessibilityRole="button"
                        hitSlop={8}
                        style={styles.recordActionButton}>
                        <Text style={styles.recordActionIcon}>✎</Text>
                      </Pressable>
                    </Link>
                    <Pressable
                      accessibilityLabel={`${entry.date} 감정 기록 삭제`}
                      accessibilityRole="button"
                      disabled={deletingEntryId !== null}
                      hitSlop={8}
                      onPress={() => confirmDelete(entry.id, entry.date)}
                      style={styles.recordActionButton}>
                      <Text style={styles.recordActionIcon}>{'🗑︎'}</Text>
                    </Pressable>
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
  modalOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  confirmDialog: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    gap: theme.spacing.md,
    maxWidth: 420,
    padding: theme.spacing.xxl,
    width: '100%',
  },
  confirmTitle: {
    color: theme.colors.text,
    fontSize: theme.fontSize.titleMedium,
    fontWeight: '800',
    textAlign: 'center',
  },
  confirmDescription: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.bodySmall,
    textAlign: 'center',
  },
  confirmActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  confirmButton: { flex: 1 },
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
    borderColor: 'transparent',
    borderRadius: theme.radius.md,
    borderWidth: 2,
    height: 58,
    justifyContent: 'center',
    width: '14.2857%',
  },
  todayCell: { backgroundColor: theme.colors.primarySoft },
  selectedDayCell: { borderColor: theme.colors.primary },
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
  recordTabs: {
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.pill,
    flexDirection: 'row',
    padding: theme.spacing.xs,
  },
  recordTab: {
    alignItems: 'center',
    borderRadius: theme.radius.pill,
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  recordTabSelected: { backgroundColor: theme.colors.primary },
  recordTabLabel: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.bodySmall,
    fontWeight: '800',
  },
  recordTabLabelSelected: { color: theme.colors.onPrimary },
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
    width: '100%',
  },
  recordMain: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: theme.spacing.md,
    minWidth: 0,
  },
  recordActions: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  recordActionButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.transparent,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  recordActionIcon: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 24,
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
