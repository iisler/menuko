import { Linking, Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/icon';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { PROTEIN_LABELS, youtubeUrl, type Meal } from '@/data/meals';
import { useTheme } from '@/hooks/use-theme';

/** Yemeğin adı, yanındakiler, türü, süresi, tarif bağlantısı ve notu. */
export function MealDetails({ meal, large }: { meal: Meal; large?: boolean }) {
  const theme = useTheme();
  const badge = theme.protein[meal.protein];

  return (
    <>
      <View style={styles.titleBlock}>
        <ThemedText type="bodyBold" style={large && styles.large}>
          {meal.main}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {meal.side}
        </ThemedText>
      </View>

      <View style={styles.meta}>
        <View style={[styles.badge, { backgroundColor: badge.background }]}>
          <ThemedText type="caption" style={{ color: badge.text }}>
            {PROTEIN_LABELS[meal.protein]}
          </ThemedText>
        </View>
        <View style={styles.inline}>
          <Icon name="clock" size={13} color={theme.textSecondary} />
          <ThemedText type="caption" themeColor="textSecondary">
            {meal.minutes} dk
          </ThemedText>
        </View>
        <Pressable
          accessibilityRole="link"
          accessibilityLabel={`${meal.main} tarifini YouTube'da ara`}
          hitSlop={10}
          style={({ pressed }) => [styles.inline, styles.recipe, pressed && styles.pressed]}
          onPress={() => Linking.openURL(youtubeUrl(meal.query)).catch(() => {})}>
          <Icon name="play" size={14} color={theme.tint} />
          <ThemedText type="caption" themeColor="tint">
            Tarif videosu
          </ThemedText>
        </Pressable>
      </View>

      <ThemedText
        type="small"
        themeColor="textSecondary"
        style={[styles.note, { backgroundColor: theme.backgroundElement }]}>
        {meal.note}
      </ThemedText>
    </>
  );
}

const styles = StyleSheet.create({
  titleBlock: { gap: Spacing.half },
  large: { fontSize: 22, lineHeight: 28 },
  inline: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  meta: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: Spacing.two + Spacing.one },
  badge: { paddingHorizontal: Spacing.two, paddingVertical: 3, borderRadius: Radius.pill },
  recipe: { marginLeft: 'auto' },
  pressed: { opacity: 0.6 },
  note: {
    paddingHorizontal: Spacing.two + Spacing.one,
    paddingVertical: Spacing.two,
    borderRadius: Radius.small,
    overflow: 'hidden',
  },
});
