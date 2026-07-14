import { forwardRef } from 'react';
import {
  StyleSheet,
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from 'react-native';

import { theme } from '@/constants/theme';

type CardPadding = 'none' | 'small' | 'medium' | 'large' | 'xlarge';
type CardVariant = 'surface' | 'muted' | 'highlight';

export type CardProps = Omit<ViewProps, 'style'> & {
  padding?: CardPadding;
  style?: StyleProp<ViewStyle>;
  variant?: CardVariant;
};

export const Card = forwardRef<View, CardProps>(function Card(
  { padding = 'large', style, variant = 'surface', ...viewProps },
  ref,
) {
  return (
    <View
      {...viewProps}
      ref={ref}
      style={[styles.base, styles[variant], styles[`${padding}Padding`], style]}
    />
  );
});

const styles = StyleSheet.create({
  base: { borderRadius: theme.radius.lg },
  surface: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
  },
  muted: { backgroundColor: theme.colors.surfaceMuted },
  highlight: { backgroundColor: theme.colors.tertiarySoft },
  nonePadding: { padding: 0 },
  smallPadding: { padding: theme.spacing.sm },
  mediumPadding: { padding: theme.spacing.md },
  largePadding: { padding: theme.spacing.xl },
  xlargePadding: { padding: theme.spacing.xxl },
});
