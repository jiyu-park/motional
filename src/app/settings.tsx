import { StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>MOTIONAL</Text>
      <Text style={styles.description}>프로필과 로컬 데이터 설정은 다음 단계에서 제공됩니다.</Text>
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
  title: { color: theme.colors.primary, fontSize: theme.fontSize.display, fontWeight: '800' },
  description: { color: theme.colors.textMuted, fontSize: theme.fontSize.body, textAlign: 'center' },
});
