import { StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';

export default function StatsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>▥</Text>
      <Text style={styles.title}>아직 개발이 완성되지 않았습니다.</Text>
      <Text style={styles.description}>감정 흐름과 활동 통계를 준비하고 있어요.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    flex: 1,
    gap: theme.spacing.md,
    justifyContent: 'center',
    padding: theme.spacing.xxl,
  },
  icon: { color: theme.colors.primary, fontSize: theme.fontSize.iconLarge },
  title: { color: theme.colors.text, fontSize: theme.fontSize.title, fontWeight: '800' },
  description: { color: theme.colors.textMuted, fontSize: theme.fontSize.body, textAlign: 'center' },
});
