import { Pressable, StyleSheet, Text } from 'react-native';

import { theme } from '@/constants/theme';

type Props = {
  emoji: string;
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function ActivityChip({ emoji, label, selected, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={[styles.chip, selected && styles.selectedChip]}>
      <Text style={[styles.label, selected && styles.selectedLabel]}>
        {emoji} {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  selectedChip: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.primary,
  },
  label: { color: theme.colors.textMuted, fontSize: theme.fontSize.bodySmall, fontWeight: '700' },
  selectedLabel: { color: theme.colors.primary },
});
