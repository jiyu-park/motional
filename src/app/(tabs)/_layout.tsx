import { Tabs, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { theme } from '@/constants/theme';

const tabIcons: Record<string, string> = {
  index: '⌂',
  calendar: '▦',
  music: '♫',
  stats: '▥',
};

export default function TabsLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerRight: () => (
          <Pressable
            accessibilityLabel="프로필 및 설정"
            hitSlop={12}
            onPress={() => router.push('/settings')}
            style={styles.profileButton}>
            <Text style={styles.profileIcon}>●</Text>
          </Pressable>
        ),
        headerShadowVisible: false,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarIcon: ({ color }) => (
          <Text style={[styles.tabIcon, { color }]}>{tabIcons[route.name]}</Text>
        ),
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: styles.tabBar,
      })}>
      <Tabs.Screen name="index" options={{ title: '홈', tabBarLabel: 'Home' }} />
      <Tabs.Screen
        name="calendar"
        options={{ title: '감정 캘린더', tabBarLabel: 'Calendar' }}
      />
      <Tabs.Screen
        name="music"
        options={{ headerShown: false, title: '음악', tabBarLabel: 'Music' }}
      />
      <Tabs.Screen name="stats" options={{ title: '통계', tabBarLabel: 'Stats' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: theme.colors.background },
  headerTitle: { color: theme.colors.text, fontWeight: '800' },
  profileButton: {
    alignItems: 'center',
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.pill,
    borderWidth: 2,
    height: 36,
    justifyContent: 'center',
    marginRight: theme.spacing.xl,
    width: 36,
  },
  profileIcon: { color: theme.colors.primary, fontSize: theme.fontSize.button },
  tabBar: {
    backgroundColor: theme.colors.surface,
    borderTopColor: theme.colors.border,
    height: 74,
    paddingBottom: theme.spacing.md,
    paddingTop: theme.spacing.sm,
  },
  tabIcon: { fontSize: theme.fontSize.icon, fontWeight: '800' },
  tabLabel: { fontSize: theme.fontSize.caption, fontWeight: '700' },
});
