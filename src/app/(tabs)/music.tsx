import { useMemo, useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TrackCard } from '@/components/music/track-card';
import { AppButton } from '@/components/ui';
import {
  directionDescriptions,
  directionLabels,
  moodGroupByMood,
  moodGroupLabels,
} from '@/constants/music-recommendation';
import { theme } from '@/constants/theme';
import { indieTracks } from '@/data/indie-tracks';
import { activities, activityById, moodById } from '@/data/moods';
import {
  createYouTubeUrl,
  getRecommendationEntry,
  recommendIndieTracks,
} from '@/services/music-recommendation';
import { useMoodStore } from '@/store/mood-store';
import type { ActivityType } from '@/types/mood';
import type { IndieTrack, RecommendationDirection } from '@/types/music';

const directions: readonly RecommendationDirection[] = ['stay', 'refresh'];

type ActivityFilterState = {
  activities: ActivityType[];
  entryVersion?: string;
};

function MusicHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Music</Text>
      <View style={styles.sceneTitle}>
        <Text style={styles.sceneEyebrow}>EMMAS</Text>
        <Text style={styles.sceneLabel}>Today&apos;s Scene</Text>
      </View>
      <Link href="/settings" asChild>
        <Pressable
          accessibilityLabel="프로필 및 설정"
          accessibilityRole="button"
          style={({ pressed }) => [styles.profileButton, pressed && styles.pressed]}>
          <Text style={styles.profileIcon}>●</Text>
        </Pressable>
      </Link>
    </View>
  );
}

export default function MusicScreen() {
  const entries = useMoodStore((state) => state.entries);
  const hasHydrated = useMoodStore((state) => state.hasHydrated);
  const isLoading = useMoodStore((state) => state.isLoading);
  const [direction, setDirection] = useState<RecommendationDirection>('stay');
  const [activityFilter, setActivityFilter] = useState<ActivityFilterState>({
    activities: [],
  });

  const recommendationEntry = useMemo(() => getRecommendationEntry(entries), [entries]);
  const entryVersion = recommendationEntry
    ? `${recommendationEntry.id}:${recommendationEntry.updatedAt}`
    : undefined;
  const selectedActivities = useMemo(
    () =>
      activityFilter.entryVersion === entryVersion
        ? activityFilter.activities
        : (recommendationEntry?.activities ?? []),
    [activityFilter, entryVersion, recommendationEntry],
  );

  const activityOptions = useMemo(() => {
    const recentActivityIds = [...entries]
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .flatMap((entry) => entry.activities);
    const orderedIds = [
      ...new Set([...recentActivityIds, ...activities.map(({ id }) => id)]),
    ];
    return orderedIds.map((id) => activityById[id]);
  }, [entries]);

  const recommendations = useMemo(
    () =>
      recommendationEntry
        ? recommendIndieTracks({
            direction,
            entry: recommendationEntry,
            selectedActivities,
            tracks: indieTracks,
          })
        : [],
    [direction, recommendationEntry, selectedActivities],
  );

  const featuredRecommendation = recommendations[0];
  const additionalRecommendations = recommendations.slice(1, 6);
  const mood = recommendationEntry ? moodById[recommendationEntry.mood] : undefined;
  const moodGroup = recommendationEntry
    ? moodGroupByMood[recommendationEntry.mood]
    : undefined;

  const toggleActivity = (activity: ActivityType) => {
    setActivityFilter({
      activities: selectedActivities.includes(activity)
        ? selectedActivities.filter((item) => item !== activity)
        : [...selectedActivities, activity],
      entryVersion,
    });
  };

  const openYouTube = async (track: IndieTrack) => {
    const url = createYouTubeUrl(track);

    try {
      const canOpen = await Linking.canOpenURL(url);
      if (!canOpen) throw new Error('Unsupported YouTube URL');
      await Linking.openURL(url);
    } catch {
      Alert.alert(
        'YouTube를 열 수 없어요',
        '외부 앱 또는 브라우저를 확인한 뒤 다시 시도해 주세요.',
      );
    }
  };

  if (!hasHydrated || isLoading) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        <MusicHeader />
        <View style={styles.centerState}>
          <Text style={styles.stateIcon}>♫</Text>
          <Text style={styles.stateTitle}>감정 기록을 불러오고 있어요</Text>
          <Text style={styles.stateDescription}>오늘의 장면을 잠시 준비할게요.</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!recommendationEntry || !mood || !moodGroup || !featuredRecommendation) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        <MusicHeader />
        <View style={styles.centerState}>
          <Text style={styles.stateIcon}>♪</Text>
          <Text style={styles.stateTitle}>아직 추천할 감정이 없어요</Text>
          <Text style={styles.stateDescription}>
            오늘의 감정을 기록하면 새로운 인디 음악을 추천해드려요.
          </Text>
          <Link href="/mood" asChild>
            <AppButton label="오늘의 감정 기록하기" />
          </Link>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <MusicHeader />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.emotionCard}>
          <Text style={styles.emotionHeading}>Music for this feeling</Text>
          <View style={styles.emotionRow}>
            <View style={[styles.moodArtwork, { backgroundColor: mood.color }]}>
              <Text style={styles.moodEmoji}>{mood.emoji}</Text>
            </View>
            <View style={styles.emotionContent}>
              <View style={styles.moodTags}>
                <View style={styles.moodTag}>
                  <Text style={styles.moodTagLabel}>{mood.label}</Text>
                </View>
                {recommendationEntry.activities.slice(0, 2).map((activity) => (
                  <View key={activity} style={styles.activitySummaryTag}>
                    <Text style={styles.activitySummaryLabel}>
                      {activityById[activity].label}
                    </Text>
                  </View>
                ))}
              </View>
              <Text style={styles.emotionReason}>
                {moodGroupLabels[moodGroup]}을 부드럽게 이어갈 음악을 골랐어요.
              </Text>
            </View>
          </View>
        </View>

        <View accessibilityRole="radiogroup" style={styles.directionSelector}>
          {directions.map((item) => {
            const selected = item === direction;
            return (
              <Pressable
                accessibilityHint={directionDescriptions[item]}
                accessibilityLabel={`${directionLabels[item]} 추천`}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                key={item}
                onPress={() => setDirection(item)}
                style={({ pressed }) => [
                  styles.directionButton,
                  selected && styles.directionButtonSelected,
                  pressed && styles.pressed,
                ]}>
                <Text
                  style={[
                    styles.directionLabel,
                    selected && styles.directionLabelSelected,
                  ]}>
                  {selected ? '✓ ' : ''}
                  {directionLabels[item]}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <ScrollView
          contentContainerStyle={styles.activityFilterRow}
          horizontal
          showsHorizontalScrollIndicator={false}>
          {activityOptions.map((activity) => {
            const selected = selectedActivities.includes(activity.id);
            return (
              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: selected }}
                key={activity.id}
                onPress={() => toggleActivity(activity.id)}
                style={({ pressed }) => [
                  styles.activityFilter,
                  selected && styles.activityFilterSelected,
                  pressed && styles.pressed,
                ]}>
                <Text
                  style={[
                    styles.activityFilterLabel,
                    selected && styles.activityFilterLabelSelected,
                  ]}>
                  {activity.emoji} {activity.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <TrackCard
          onListen={openYouTube}
          score={featuredRecommendation.score}
          track={featuredRecommendation.track}
          variant="featured"
        />
        <Text style={styles.externalNotice}>
          ↗ 재생은 YouTube 외부 앱 또는 브라우저에서 진행됩니다.
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Music for this Scene</Text>
          <View style={styles.trackList}>
            {additionalRecommendations.map(({ score, track }) => (
              <TrackCard
                key={track.id}
                onListen={openYouTube}
                score={score}
                track={track}
              />
            ))}
          </View>
        </View>

        <View style={styles.artistCard}>
          <Text style={styles.artistBadge}>ARTIST FOUND TODAY</Text>
          <View style={styles.artistRow}>
            <View style={styles.artistPortrait}>
              <Text style={styles.artistPortraitIcon}>♬</Text>
            </View>
            <View style={styles.artistInfo}>
              <Text numberOfLines={2} style={styles.artistName}>
                {featuredRecommendation.track.artist}
              </Text>
              <Text style={styles.artistGenre}>오늘의 인디 아티스트</Text>
            </View>
          </View>
          <Text style={styles.artistDescription}>
            오늘의 대표 추천에서 만난 아티스트예요. 곡 정보는 YouTube 검색 결과에서
            확인할 수 있어요.
          </Text>
        </View>

        <Text style={styles.dataNotice}>
          곡명과 아티스트는 ref/music.html을 사용하며 추천 메타데이터는 mock입니다.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: theme.colors.background, flex: 1 },
  header: {
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 64,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.sm,
  },
  headerTitle: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.title,
    fontWeight: '800',
    width: 72,
  },
  sceneTitle: { alignItems: 'center' },
  sceneEyebrow: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.caption,
    fontWeight: '800',
    letterSpacing: 1.4,
    opacity: 0.65,
  },
  sceneLabel: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.label,
    fontWeight: '800',
  },
  profileButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceMuted,
    borderColor: theme.colors.primarySoft,
    borderRadius: theme.radius.pill,
    borderWidth: 2,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  profileIcon: { color: theme.colors.primary, fontSize: theme.fontSize.iconSmall },
  content: {
    gap: theme.spacing.xxl,
    paddingBottom: theme.spacing.xxxl,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
  },
  emotionCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    gap: theme.spacing.lg,
    overflow: 'hidden',
    padding: theme.spacing.xl,
  },
  emotionHeading: {
    color: theme.colors.text,
    fontSize: theme.fontSize.title,
    fontWeight: '800',
  },
  emotionRow: { alignItems: 'center', flexDirection: 'row', gap: theme.spacing.lg },
  moodArtwork: {
    alignItems: 'center',
    borderRadius: theme.radius.xl,
    height: 80,
    justifyContent: 'center',
    width: 80,
  },
  moodEmoji: {
    color: theme.colors.text,
    fontSize: theme.fontSize.titleLarge,
    fontWeight: '800',
  },
  emotionContent: { flex: 1, gap: theme.spacing.sm },
  moodTags: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.xs },
  moodTag: {
    backgroundColor: theme.colors.tertiarySoft,
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  moodTagLabel: {
    color: theme.colors.successText,
    fontSize: theme.fontSize.labelSmall,
    fontWeight: '800',
  },
  activitySummaryTag: {
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  activitySummaryLabel: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.labelSmall,
    fontWeight: '700',
  },
  emotionReason: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.label,
    lineHeight: theme.lineHeight.compact,
  },
  directionSelector: {
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.pill,
    flexDirection: 'row',
    gap: theme.spacing.xs,
    padding: theme.spacing.xs,
  },
  directionButton: {
    alignItems: 'center',
    borderRadius: theme.radius.pill,
    flex: 1,
    justifyContent: 'center',
    minHeight: 46,
    paddingHorizontal: theme.spacing.lg,
  },
  directionButtonSelected: { backgroundColor: theme.colors.primarySoft },
  directionLabel: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.bodySmall,
    fontWeight: '800',
  },
  directionLabelSelected: { color: theme.colors.primary },
  activityFilterRow: { gap: theme.spacing.sm, paddingRight: theme.spacing.xl },
  activityFilter: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 42,
    paddingHorizontal: theme.spacing.lg,
  },
  activityFilterSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  activityFilterLabel: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.label,
    fontWeight: '800',
  },
  activityFilterLabelSelected: { color: theme.colors.onPrimary },
  pressed: { opacity: 0.7 },
  externalNotice: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.caption,
    marginTop: -theme.spacing.lg,
    textAlign: 'center',
  },
  section: { gap: theme.spacing.md },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: theme.fontSize.title,
    fontWeight: '800',
  },
  trackList: { gap: theme.spacing.md },
  artistCard: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    gap: theme.spacing.lg,
    overflow: 'hidden',
    padding: theme.spacing.xl,
  },
  artistBadge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.pill,
    color: theme.colors.onPrimary,
    fontSize: theme.fontSize.caption,
    fontWeight: '800',
    letterSpacing: 0.6,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  artistRow: { alignItems: 'center', flexDirection: 'row', gap: theme.spacing.lg },
  artistPortrait: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.surface,
    borderRadius: theme.radius.pill,
    borderWidth: 4,
    height: 80,
    justifyContent: 'center',
    width: 80,
  },
  artistPortraitIcon: { color: theme.colors.primary, fontSize: theme.fontSize.iconLarge },
  artistInfo: { flex: 1, gap: theme.spacing.xs },
  artistName: {
    color: theme.colors.text,
    fontSize: theme.fontSize.titleLarge,
    fontWeight: '800',
  },
  artistGenre: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.labelSmall,
    fontWeight: '800',
  },
  artistDescription: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.bodySmall,
    lineHeight: theme.lineHeight.body,
  },
  dataNotice: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.caption,
    textAlign: 'center',
  },
  centerState: {
    alignItems: 'center',
    flex: 1,
    gap: theme.spacing.md,
    justifyContent: 'center',
    padding: theme.spacing.xxl,
  },
  stateIcon: { color: theme.colors.primary, fontSize: theme.fontSize.iconLarge },
  stateTitle: {
    color: theme.colors.text,
    fontSize: theme.fontSize.title,
    fontWeight: '800',
    textAlign: 'center',
  },
  stateDescription: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.body,
    lineHeight: theme.lineHeight.body,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
});
