import { Linking, Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Icon } from '@/components/icon';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { DAYS, PROTEIN_LABELS, youtubeUrl, type Meal } from '@/data/meals';
import { useTheme } from '@/hooks/use-theme';
import { tap } from '@/lib/haptics';
import { actions } from '@/store/app-store';

type Props = { day: number; meal: Meal | undefined; locked: boolean; isToday: boolean };

export function DayCard({ day, meal, locked, isToday }: Props) {
  const theme = useTheme();
  const badge = meal ? theme.protein[meal.protein] : undefined;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.card, borderColor: locked ? theme.tint : theme.border },
        locked && styles.cardLocked,
      ]}>
      <View style={styles.row}>
        <ThemedText type="heading" themeColor={isToday ? 'tint' : 'textSecondary'}>
          {DAYS[day]}
          {isToday ? ' · Bugün' : ''}
        </ThemedText>
        {locked ? (
          <View style={styles.inline}>
            <Icon name="lock" size={12} color={theme.tint} />
            <ThemedText type="caption" themeColor="tint">
              Kilitli
            </ThemedText>
          </View>
        ) : null}
      </View>

      {meal && badge ? (
        <>
          <View style={styles.titleBlock}>
            <ThemedText type="bodyBold">{meal.main}</ThemedText>
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
      ) : (
        <ThemedText type="small" themeColor="textSecondary">
          Tercihlerinize uyan yemek kalmadı. Ayarlar’dan istemediğiniz malzemeleri azaltabilirsiniz.
        </ThemedText>
      )}

      <View style={styles.actions}>
        <Button
          fill
          label={locked ? 'Kilidi aç' : 'Kilitle'}
          icon={locked ? 'unlock' : 'lock'}
          variant={locked ? 'soft' : 'outline'}
          disabled={!meal}
          onPress={() => {
            tap();
            actions.toggleLock(day);
          }}
        />
        <Button
          fill
          label="Değiştir"
          icon="swap"
          disabled={locked}
          onPress={() => {
            tap();
            actions.changeDay(day);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: Radius.large,
    padding: Spacing.three,
    gap: Spacing.two + Spacing.one,
  },
  cardLocked: { borderWidth: 1.5 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  inline: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  titleBlock: { gap: Spacing.half },
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
  actions: { flexDirection: 'row', gap: Spacing.two, marginTop: Spacing.one },
});
