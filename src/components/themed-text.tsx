import { StyleSheet, Text, type TextProps } from 'react-native';

import { ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'heading' | 'bodyBold' | 'small' | 'smallBold' | 'caption';
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();
  return <Text style={[{ color: theme[themeColor ?? 'text'] }, styles[type], style]} {...rest} />;
}

const styles = StyleSheet.create({
  default: { fontSize: 16, lineHeight: 24 },
  bodyBold: { fontSize: 17, lineHeight: 23, fontWeight: 600 },
  title: { fontSize: 30, lineHeight: 36, fontWeight: 700 },
  // Büyük harfe çevirme yok: 'i' → 'İ' dönüşümü platformlar arasında tutarlı değil.
  heading: { fontSize: 14, lineHeight: 18, fontWeight: 600, letterSpacing: 0.2 },
  small: { fontSize: 14, lineHeight: 20 },
  smallBold: { fontSize: 14, lineHeight: 20, fontWeight: 600 },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: 500 },
});
