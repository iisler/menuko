import { Pressable, StyleSheet, type PressableProps } from 'react-native';

import { Icon, type IconName } from '@/components/icon';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = Omit<PressableProps, 'style' | 'children'> & {
  label: string;
  icon?: IconName;
  variant?: 'primary' | 'soft' | 'outline';
  /** Yan yana duran düğmelerin alanı eşit paylaşması için */
  fill?: boolean;
};

export function Button({ label, icon, variant = 'outline', fill, ...rest }: Props) {
  const theme = useTheme();
  const palette = {
    primary: { background: theme.tint, text: theme.onTint, border: theme.tint },
    soft: { background: theme.tintSoft, text: theme.tint, border: theme.tintSoft },
    outline: { background: 'transparent', text: theme.text, border: theme.border },
  }[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: palette.background, borderColor: palette.border },
        fill && styles.fill,
        pressed && styles.pressed,
        rest.disabled && styles.disabled,
      ]}
      {...rest}>
      {icon ? <Icon name={icon} size={16} color={palette.text} /> : null}
      <ThemedText type="smallBold" style={{ color: palette.text }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.medium,
    borderWidth: 1,
  },
  fill: { flex: 1 },
  pressed: { opacity: 0.6 },
  disabled: { opacity: 0.4 },
});
