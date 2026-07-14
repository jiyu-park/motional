import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';
import type { Mood } from '@/types/mood';

type Props = {
  mood: Mood;
  selected: boolean;
  onPress: () => void;
};

export function MoodOption({ mood, selected, onPress }: Props) {
  return (
    <Pressable
      accessibilityLabel={`${mood.label} 감정`}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={styles.container}>
      <View
        style={[
          styles.face,
          { backgroundColor: mood.color },
          selected && styles.faceSelected,
        ]}>
        <Text style={styles.emoji}>{mood.emoji}</Text>
      </View>
      <Text style={[styles.label, selected && styles.labelSelected]}>{mood.label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: theme.spacing.sm, width: '25%' },
  face: {
    alignItems: 'center',
    borderColor: theme.colors.transparent,
    borderRadius: theme.radius.pill,
    borderWidth: 3,
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
  faceSelected: { borderColor: theme.colors.primary, transform: [{ scale: 1.08 }] },
  emoji: { color: theme.colors.text, fontSize: theme.fontSize.iconSmall, fontWeight: '800' },
  label: { color: theme.colors.textMuted, fontSize: theme.fontSize.labelSmall, fontWeight: '700' },
  labelSelected: { color: theme.colors.primary },
});
