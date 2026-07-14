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

type ButtonSize = 'small' | 'medium';
type ButtonVariant = 'primary' | 'soft';

export type AppButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  size?: ButtonSize;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  variant?: ButtonVariant;
};

export const AppButton = forwardRef<View, AppButtonProps>(function AppButton(
  {
    accessibilityState,
    disabled = false,
    label,
    size = 'medium',
    style,
    textStyle,
    variant = 'primary',
    ...pressableProps
  },
  ref,
) {
  const isDisabled = disabled === true;

  return (
    <Pressable
      {...pressableProps}
      accessibilityRole="button"
      accessibilityState={{ ...accessibilityState, disabled: isDisabled }}
      disabled={isDisabled}
      ref={ref}
      style={[
        styles.base,
        styles[`${variant}Button`],
        styles[`${size}Button`],
        isDisabled && styles.disabled,
        style,
      ]}>
      <Text
        style={[
          styles.label,
          styles[`${variant}Label`],
          styles[`${size}Label`],
          textStyle,
        ]}>
        {label}
      </Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderRadius: theme.radius.pill,
    justifyContent: 'center',
  },
  primaryButton: { backgroundColor: theme.colors.primary },
  softButton: { backgroundColor: theme.colors.primarySoft },
  smallButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  mediumButton: {
    paddingHorizontal: theme.spacing.xxl,
    paddingVertical: theme.spacing.lg,
  },
  disabled: { opacity: 0.35 },
  label: { fontWeight: '800' },
  primaryLabel: { color: theme.colors.onPrimary },
  softLabel: { color: theme.colors.primary },
  smallLabel: { fontSize: theme.fontSize.bodySmall },
  mediumLabel: { fontSize: theme.fontSize.button },
});
