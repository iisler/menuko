import type { ReactNode } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = { title: string; subtitle?: string; action?: ReactNode; children: ReactNode };

/** Sekme ekranlarının ortak iskeleti: kaydırılabilir alan, büyük başlık ve güvenli alan boşlukları. */
export function Screen({ title, subtitle, action, children }: Props) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  // Web'de sekme çubuğu üstte, mobilde altta durur.
  const top = Platform.OS === 'web' ? 88 : insets.top + Spacing.three;
  const bottom = insets.bottom + BottomTabInset + Spacing.four;

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={[styles.content, { paddingTop: top, paddingBottom: bottom }]}>
      <View style={styles.inner}>
        <View style={styles.header}>
          <View style={styles.titles}>
            {subtitle ? (
              <ThemedText type="heading" themeColor="textSecondary">
                {subtitle}
              </ThemedText>
            ) : null}
            <ThemedText type="title" accessibilityRole="header">
              {title}
            </ThemedText>
          </View>
          {action}
        </View>
        {children}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.three,
    alignItems: 'center',
  },
  inner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    gap: Spacing.three,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: Spacing.two,
    marginBottom: Spacing.one,
  },
  titles: { flexShrink: 1, gap: Spacing.half },
});
