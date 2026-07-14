import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { moods } from '@/data/moods';
import { useMoodStore } from '@/store/mood-store';
import { theme } from '@/constants/theme';

export default function HomeScreen() {
  const latestEntry = useMoodStore((state) => state.entries[0]);
  const latestMood = moods.find((mood) => mood.id === latestEntry?.mood);

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>오늘의 감정</Text>
        <View style={styles.heroCard}>
          {latestMood ? (
            <>
              <Text style={styles.moodEmoji}>{latestMood.emoji}</Text>
              <Text style={styles.heroTitle}>{latestMood.label}</Text>
              <Text style={styles.description}>최근 기록한 감정이에요.</Text>
            </>
          ) : (
            <>
              <Text style={styles.moodEmoji}>◌</Text>
              <Text style={styles.heroTitle}>지금 기분이 어떤가요?</Text>
              <Text style={styles.description}>짧게 기록하고 오늘을 돌아보세요.</Text>
            </>
          )}
          <Link href="/mood" asChild>
            <Pressable style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>
                {latestMood ? '한 번 더 기록' : '감정 기록하기'}
              </Text>
            </Pressable>
          </Link>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>기록은 내 기기에 저장돼요</Text>
          <Text style={styles.description}>
            감정과 활동, 메모를 남기면 Calendar에서 바로 확인할 수 있어요.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: theme.colors.background, flex: 1 },
  content: { gap: theme.spacing.xl, padding: theme.spacing.xl },
  eyebrow: { color: theme.colors.textMuted, fontSize: theme.fontSize.bodySmall, fontWeight: '700' },
  heroCard: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.xxl,
  },
  moodEmoji: { fontSize: theme.fontSize.mood },
  heroTitle: { color: theme.colors.text, fontSize: theme.fontSize.titleLarge, fontWeight: '800' },
  description: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.body,
    lineHeight: theme.lineHeight.body,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.pill,
    marginTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.xxl,
    paddingVertical: theme.spacing.lg,
  },
  primaryButtonText: {
    color: theme.colors.onPrimary,
    fontSize: theme.fontSize.button,
    fontWeight: '800',
  },
  infoCard: {
    backgroundColor: theme.colors.tertiarySoft,
    borderRadius: theme.radius.lg,
    gap: theme.spacing.sm,
    padding: theme.spacing.xl,
  },
  cardTitle: { color: theme.colors.text, fontSize: theme.fontSize.titleSmall, fontWeight: '800' },
});
