import { Pressable, StyleSheet, Text, View } from 'react-native';

import { directionLabels } from '@/constants/music-recommendation';
import { theme } from '@/constants/theme';
import { activityById } from '@/data/moods';
import type { IndieTrack } from '@/types/music';

type TrackCardProps = {
  onListen: (track: IndieTrack) => void;
  score?: number;
  track: IndieTrack;
  variant?: 'featured' | 'list';
};

export function TrackCard({
  onListen,
  score,
  track,
  variant = 'list',
}: TrackCardProps) {
  if (variant === 'featured') {
    return (
      <View style={styles.featuredCard}>
        <View style={styles.featuredHeader}>
          <View style={styles.featuredHeading}>
            <Text style={styles.eyebrow}>PICK OF THE SCENE</Text>
            <Text numberOfLines={2} style={styles.featuredTitle}>
              {track.title}
            </Text>
            <Text numberOfLines={1} style={styles.featuredArtist}>
              {track.artist}
            </Text>
          </View>
        </View>

        <Text style={styles.featuredReason}>“{track.recommendationText}”</Text>
        <View style={styles.tagRow}>
          {track.activities.slice(0, 3).map((activity) => (
            <View key={activity} style={styles.trackTag}>
              <Text style={styles.trackTagLabel}>#{activityById[activity].label}</Text>
            </View>
          ))}
          {score !== undefined ? (
            <View style={styles.scoreTag}>
              <Text style={styles.scoreLabel}>추천 {score}</Text>
            </View>
          ) : null}
        </View>

        <Pressable
          accessibilityHint="외부 YouTube 앱 또는 브라우저로 이동합니다"
          accessibilityLabel={`${track.artist}의 ${track.title} YouTube에서 듣기`}
          accessibilityRole="link"
          onPress={() => onListen(track)}
          style={({ pressed }) => [styles.featuredListenButton, pressed && styles.pressed]}>
          <Text style={styles.youtubePlay}>▶</Text>
          <Text style={styles.featuredListenLabel}>YouTube에서 듣기</Text>
          <Text style={styles.externalIcon}>↗</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.listCard}>
      <View style={styles.listArtwork}>
        <Text style={styles.listArtworkIcon}>{track.icon ?? '♫'}</Text>
      </View>
      <View style={styles.listContent}>
        <Text numberOfLines={1} style={styles.listTitle}>
          {track.title}
        </Text>
        <Text numberOfLines={1} style={styles.listArtist}>
          {track.artist}
        </Text>
        <Text style={styles.directionLabel}>{directionLabels[track.direction]}</Text>
      </View>
      <Pressable
        accessibilityHint="외부 YouTube 앱 또는 브라우저로 이동합니다"
        accessibilityLabel={`${track.artist}의 ${track.title} YouTube에서 듣기`}
        accessibilityRole="link"
        hitSlop={8}
        onPress={() => onListen(track)}
        style={({ pressed }) => [styles.listListenButton, pressed && styles.pressed]}>
        <Text style={styles.listListenIcon}>▶</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  featuredCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    gap: theme.spacing.xl,
    overflow: 'hidden',
    padding: theme.spacing.xl,
  },
  featuredHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  featuredHeading: { flex: 1, gap: theme.spacing.xs, paddingRight: theme.spacing.md },
  eyebrow: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.caption,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  featuredTitle: {
    color: theme.colors.text,
    fontSize: theme.fontSize.titleLarge,
    fontWeight: '800',
  },
  featuredArtist: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.subtitle,
    fontWeight: '700',
  },
  featuredReason: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.bodySmall,
    fontStyle: 'italic',
    lineHeight: theme.lineHeight.body,
  },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  trackTag: {
    backgroundColor: theme.colors.secondarySoft,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  trackTagLabel: {
    color: theme.colors.secondary,
    fontSize: theme.fontSize.caption,
    fontWeight: '700',
  },
  scoreTag: {
    backgroundColor: theme.colors.tertiarySoft,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  scoreLabel: {
    color: theme.colors.successText,
    fontSize: theme.fontSize.caption,
    fontWeight: '800',
  },
  featuredListenButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.youtubeSoft,
    borderColor: theme.colors.youtube,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    flexDirection: 'row',
    gap: theme.spacing.sm,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: theme.spacing.lg,
  },
  youtubePlay: { color: theme.colors.youtube, fontSize: theme.fontSize.bodySmall },
  featuredListenLabel: {
    color: theme.colors.youtube,
    fontSize: theme.fontSize.bodySmall,
    fontWeight: '800',
  },
  externalIcon: { color: theme.colors.youtube, fontSize: theme.fontSize.iconSmall },
  listCard: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: theme.spacing.md,
    padding: theme.spacing.md,
  },
  listArtwork: {
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.md,
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
  listArtworkIcon: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.icon,
    fontWeight: '800',
  },
  listContent: { flex: 1, gap: theme.spacing.xxs, minWidth: 0 },
  listTitle: {
    color: theme.colors.text,
    fontSize: theme.fontSize.body,
    fontWeight: '800',
  },
  listArtist: { color: theme.colors.textMuted, fontSize: theme.fontSize.labelSmall },
  directionLabel: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.caption,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  listListenButton: {
    alignItems: 'center',
    borderRadius: theme.radius.pill,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  listListenIcon: { color: theme.colors.youtube, fontSize: theme.fontSize.iconSmall },
  pressed: { opacity: 0.65 },
});
