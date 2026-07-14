import { Link } from 'expo-router';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton, Card } from '@/components/ui';
import { theme } from '@/constants/theme';
import { moods } from '@/data/moods';
import { useMoodStore } from '@/store/mood-store';

export default function HomeScreen() {
  const latestEntry = useMoodStore((state) => state.entries[0]);
  const latestMood = moods.find((mood) => mood.id === latestEntry?.mood);

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>오늘의 감정</Text>
        <Card padding="xlarge" style={styles.heroCard}>
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
            <AppButton
              label={latestMood ? '한 번 더 기록' : '감정 기록하기'}
              style={styles.primaryButton}
            />
          </Link>
        </Card>

        <Card variant="highlight" style={styles.infoCard}>
          <Text style={styles.cardTitle}>기록은 내 기기에 저장돼요</Text>
          <Text style={styles.description}>
            감정과 활동, 메모를 남기면 Calendar에서 바로 확인할 수 있어요.
          </Text>
        </Card>
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
    borderRadius: theme.radius.xl,
    gap: theme.spacing.sm,
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
    marginTop: theme.spacing.md,
  },
  infoCard: {
    gap: theme.spacing.sm,
  },
  cardTitle: { color: theme.colors.text, fontSize: theme.fontSize.titleSmall, fontWeight: '800' },
});
