import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { DayCard } from '@/components/day-card';
import { MealDetails } from '@/components/meal-details';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { MEALS_BY_ID, PROTEINS, PROTEIN_LABELS, type Protein } from '@/data/meals';
import { useTheme } from '@/hooks/use-theme';
import { tap } from '@/lib/haptics';
import { matchingMeals, suggestMeal, type SuggestFilters } from '@/lib/suggest';
import { todayIndex, todayLabel } from '@/lib/week';
import { actions, useAppState } from '@/store/app-store';

const TIME_OPTIONS: { label: string; a11y: string; value: number | undefined }[] = [
  { label: 'Süre fark etmez', a11y: 'Süre fark etmez', value: undefined },
  { label: '≤ 30 dk', a11y: '30 dakikaya kadar', value: 30 },
  { label: '≤ 45 dk', a11y: '45 dakikaya kadar', value: 45 },
];

export default function TodayScreen() {
  const theme = useTheme();
  const { plan, locked, excluded } = useAppState();
  const today = todayIndex();
  const todayMealId = plan[today];

  const [maxMinutes, setMaxMinutes] = useState<number | undefined>(undefined);
  const [proteins, setProteins] = useState<Protein[]>([]);
  /** Bu oturumda gösterilen öneriler; "Başka öner" bunları tekrar etmemeye çalışır. */
  const [shown, setShown] = useState<string[]>([]);
  const [suggestion, setSuggestion] = useState<string | null>(
    () => suggestMeal({ excluded, proteins: [], maxMinutes: undefined }, plan.filter(Boolean) as string[], null)?.id ?? null,
  );

  const filters: SuggestFilters = { excluded, proteins, maxMinutes };
  const matches = matchingMeals(filters);
  // Ayarlarda bir malzeme yasaklandıysa eldeki öneri artık uymayabilir.
  const current = suggestion && matches.some((m) => m.id === suggestion) ? MEALS_BY_ID[suggestion] : undefined;

  function suggest(next: SuggestFilters = filters) {
    const avoid = [...(plan.filter(Boolean) as string[]), ...shown];
    const meal = suggestMeal(next, avoid, suggestion);
    if (meal) setShown((list) => [...list.filter((id) => id !== meal.id), meal.id]);
    setSuggestion(meal?.id ?? null);
  }

  function changeTime(value: number | undefined) {
    tap();
    setMaxMinutes(value);
    suggest({ ...filters, maxMinutes: value });
  }

  function toggleProtein(protein: Protein) {
    tap();
    const next = proteins.includes(protein)
      ? proteins.filter((p) => p !== protein)
      : PROTEINS.filter((p) => p === protein || proteins.includes(p));
    setProteins(next);
    suggest({ ...filters, proteins: next });
  }

  const isTodaysMeal = current !== undefined && current.id === todayMealId;

  return (
    <Screen title="Bugün ne pişirsem?" subtitle={todayLabel()}>
      <DayCard
        day={today}
        meal={todayMealId ? MEALS_BY_ID[todayMealId] : undefined}
        locked={locked[today]}
        isToday
        label="Plana göre bugün"
        large
      />

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText type="heading" themeColor="textSecondary">
            Şimdi ne pişireyim?
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Canın başka bir şey mi çekti? Ne kadar vaktin olduğunu ve ne istediğini seç, bir öneri
            getireyim.
          </ThemedText>
        </View>

        <View style={styles.chips}>
          {TIME_OPTIONS.map((option) => (
            <Chip
              key={option.label}
              label={option.label}
              a11yLabel={option.a11y}
              selected={maxMinutes === option.value}
              role="radio"
              onPress={() => changeTime(option.value)}
            />
          ))}
        </View>
        <View style={styles.chips}>
          {PROTEINS.map((protein) => (
            <Chip
              key={protein}
              label={PROTEIN_LABELS[protein]}
              selected={proteins.includes(protein)}
              role="checkbox"
              onPress={() => toggleProtein(protein)}
            />
          ))}
        </View>

        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {current ? (
            <>
              <ThemedText type="heading" themeColor="tint">
                Önerim
              </ThemedText>
              <MealDetails meal={current} large />
              <View style={styles.actions}>
                <Button
                  fill
                  label="Başka öner"
                  icon="shuffle"
                  disabled={matches.length < 2}
                  onPress={() => {
                    tap();
                    suggest();
                  }}
                />
                <Button
                  fill
                  label={isTodaysMeal ? 'Eklendi' : 'Bugüne koy'}
                  icon={isTodaysMeal ? 'check' : 'plus'}
                  variant="primary"
                  disabled={isTodaysMeal || locked[today]}
                  onPress={() => {
                    tap();
                    actions.setDayMeal(today, current.id);
                  }}
                />
              </View>
              {locked[today] && !isTodaysMeal ? (
                <ThemedText type="caption" themeColor="textSecondary">
                  Bugün kilitli. Planına eklemek için önce kilidi aç.
                </ThemedText>
              ) : null}
            </>
          ) : (
            <>
              <ThemedText themeColor="textSecondary">
                {matches.length === 0
                  ? 'Bu seçimlere uyan yemek yok. Süreyi ya da türleri genişletmeyi dene.'
                  : 'Bir öneri getireyim mi?'}
              </ThemedText>
              {matches.length > 0 ? (
                <Button label="Öner" icon="shuffle" variant="primary" onPress={() => suggest()} />
              ) : null}
            </>
          )}
        </View>
      </View>
    </Screen>
  );
}

function Chip(props: {
  label: string;
  a11yLabel?: string;
  selected: boolean;
  role: 'radio' | 'checkbox';
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole={props.role}
      accessibilityState={props.role === 'radio' ? { selected: props.selected } : { checked: props.selected }}
      accessibilityLabel={props.a11yLabel ?? props.label}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: props.selected ? theme.tint : theme.card,
          borderColor: props.selected ? theme.tint : theme.border,
        },
        pressed && styles.pressed,
      ]}
      onPress={props.onPress}>
      <ThemedText type="small" style={{ color: props.selected ? theme.onTint : theme.text }}>
        {props.label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.two + Spacing.one, marginTop: Spacing.two },
  sectionHeader: { gap: Spacing.one, paddingHorizontal: Spacing.one },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  chip: {
    minHeight: 38,
    justifyContent: 'center',
    paddingHorizontal: Spacing.two + Spacing.one,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  pressed: { opacity: 0.6 },
  card: {
    borderWidth: 1,
    borderRadius: Radius.large,
    padding: Spacing.three,
    gap: Spacing.two + Spacing.one,
  },
  actions: { flexDirection: 'row', gap: Spacing.two, marginTop: Spacing.one },
});
