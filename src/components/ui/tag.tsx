import { forwardRef } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type View,
  type ViewStyle,
} from 'react-native';

import { theme } from '@/constants/theme';

export type TagProps = Omit<PressableProps, 'children' | 'style'> & {
  emoji?: string;
  label: string;
  selected?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export const Tag = forwardRef<View, TagProps>(function Tag(
  {
    accessibilityState,
    disabled = false,
    emoji,
    label,
    selected = false,
    style,
    textStyle,
    ...pressableProps
  },
  ref,
) {
  const isDisabled = disabled === true;

  return (
    <Pressable
      {...pressableProps}
      accessibilityRole="checkbox"
      accessibilityState={{ ...accessibilityState, checked: selected, disabled: isDisabled }}
      disabled={isDisabled}
      ref={ref}
      style={[styles.base, selected && styles.selected, isDisabled && styles.disabled, style]}>
      <Text style={[styles.label, selected && styles.selectedLabel, textStyle]}>
        {emoji ? `${emoji} ` : null}
        {label}
      </Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  base: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  selected: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.primary,
  },
  disabled: { opacity: 0.35 },
  label: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.bodySmall,
    fontWeight: '700',
  },
  selectedLabel: { color: theme.colors.primary },
});
