import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Icon } from '@/components/icon';
import { MealDetails } from '@/components/meal-details';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { DAYS, type Meal } from '@/data/meals';
import { useTheme } from '@/hooks/use-theme';
import { tap } from '@/lib/haptics';
import { actions } from '@/store/app-store';

type Props = {
  day: number;
  meal: Meal | undefined;
  locked: boolean;
  isToday: boolean;
  /** Gün adı yerine gösterilecek başlık (ör. "Plana göre bugün") */
  label?: string;
  large?: boolean;
};

export function DayCard({ day, meal, locked, isToday, label, large }: Props) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.card, borderColor: locked ? theme.tint : theme.border },
        locked && styles.cardLocked,
      ]}>
      <View style={styles.row}>
        <ThemedText type="heading" themeColor={isToday ? 'tint' : 'textSecondary'}>
          {label ?? `${DAYS[day]}${isToday ? ' · Bugün' : ''}`}
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

      {meal ? (
        <MealDetails meal={meal} large={large} />
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
  actions: { flexDirection: 'row', gap: Spacing.two, marginTop: Spacing.one },
});
