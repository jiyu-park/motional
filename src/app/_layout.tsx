import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { theme } from '@/constants/theme';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: theme.colors.background },
          headerShadowVisible: false,
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.primary,
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="mood"
          options={{ presentation: 'modal', title: '감정 기록' }}
        />
        <Stack.Screen name="settings" options={{ title: '설정' }} />
      </Stack>
    </>
  );
}
