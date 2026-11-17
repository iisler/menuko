import { Alert, Platform, Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Icon } from '@/components/icon';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  DAYS,
  INGREDIENTS,
  MEALS,
  PROTEINS,
  PROTEIN_LABELS,
  type IngredientKey,
} from '@/data/meals';
import { useTheme } from '@/hooks/use-theme';
import { tap } from '@/lib/haptics';
import { eligibleMeals } from '@/lib/planner';
import { actions, MAX_SERVINGS, MIN_SERVINGS, useAppState } from '@/store/app-store';

const INGREDIENT_KEYS = (Object.keys(INGREDIENTS) as IngredientKey[]).filter(
  (key) => key !== 'pisirmeKagidi',
);

function confirmReset() {
  const message = 'Plan, alışveriş işaretleri ve tüm tercihler varsayılana döner.';
  if (Platform.OS === 'web') {
    if (window.confirm(message)) actions.reset();
    return;
  }
  Alert.alert('Her şey sıfırlansın mı?', message, [
    { text: 'Vazgeç', style: 'cancel' },
    { text: 'Sıfırla', style: 'destructive', onPress: actions.reset },
  ]);
}

export default function SettingsScreen() {
  const theme = useTheme();
  const { servings, pattern, excluded } = useAppState();
  const cardStyle = [styles.card, { backgroundColor: theme.card, borderColor: theme.border }];
  const available = eligibleMeals(excluded).length;

  return (
    <Screen title="Ayarlar">
      <Section title="Kişi sayısı" hint="Alışveriş listesindeki miktarlar buna göre hesaplanır.">
        <View style={[cardStyle, styles.stepperRow]}>
          <ThemedText type="bodyBold">{servings} kişi</ThemedText>
          <View style={styles.stepper}>
            <StepButton
              icon="minus"
              label="Kişi sayısını azalt"
              disabled={servings <= MIN_SERVINGS}
              onPress={() => actions.setServings(servings - 1)}
            />
            <StepButton
              icon="plus"
              label="Kişi sayısını artır"
              disabled={servings >= MAX_SERVINGS}
              onPress={() => actions.setServings(servings + 1)}
            />
          </View>
        </View>
      </Section>

      <Section
        title="Haftalık düzen"
        hint="Her gün için bir ya da birkaç ana malzeme seçin. Birden fazla seçerseniz o gün için aralarından rastgele biri gelir. Kilitli günler değişmez.">
        <View style={[cardStyle, styles.patternCard]}>
          {DAYS.map((dayName, day) => (
            <View key={dayName} style={styles.patternRow}>
              <View style={styles.patternHeader}>
                <ThemedText type="small" style={styles.patternDay}>
                  {dayName}
                </ThemedText>
                {pattern[day].length > 1 ? (
                  <ThemedText type="caption" themeColor="textSecondary">
                    {pattern[day].length} türden rastgele
                  </ThemedText>
                ) : null}
              </View>
              <View style={[styles.segment, { backgroundColor: theme.backgroundElement }]}>
                {PROTEINS.map((protein) => {
                  const selected = pattern[day].includes(protein);
                  // En az bir tür seçili kalmalı: son seçili tür kapatılamaz.
                  const isLast = selected && pattern[day].length === 1;
                  const colors = theme.protein[protein];
                  return (
                    <Pressable
                      key={protein}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: selected, disabled: isLast }}
                      disabled={isLast}
                      accessibilityLabel={`${dayName}: ${PROTEIN_LABELS[protein]}`}
                      style={[styles.segmentItem, selected && { backgroundColor: colors.text }]}
                      onPress={() => {
                        tap();
                        actions.toggleDayProtein(day, protein);
                      }}>
                      <ThemedText
                        type="caption"
                        numberOfLines={1}
                        style={[
                          { color: selected ? colors.background : theme.textSecondary },
                          selected && styles.segmentSelected,
                        ]}>
                        {PROTEIN_LABELS[protein]}
                      </ThemedText>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      </Section>

      <Section
        title="İstemediğim malzemeler"
        hint={`Seçtiğiniz malzemeleri içeren yemekler önerilmez. Şu an ${MEALS.length} yemekten ${available} tanesi uygun.`}>
        {CATEGORY_ORDER.map((category) => (
          <View key={category} style={styles.chipGroup}>
            <ThemedText type="caption" themeColor="textSecondary">
              {CATEGORY_LABELS[category]}
            </ThemedText>
            <View style={styles.chips}>
              {INGREDIENT_KEYS.filter((key) => INGREDIENTS[key].category === category).map((key) => {
                const selected = excluded.includes(key);
                return (
                  <Pressable
                    key={key}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: selected }}
                    accessibilityLabel={INGREDIENTS[key].name}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: selected ? theme.tint : theme.card,
                        borderColor: selected ? theme.tint : theme.border,
                      },
                    ]}
                    onPress={() => {
                      tap();
                      actions.toggleExcluded(key);
                    }}>
                    <ThemedText
                      type="small"
                      style={[
                        { color: selected ? theme.onTint : theme.text },
                        selected && styles.strike,
                      ]}>
                      {INGREDIENTS[key].name}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}
      </Section>

      <Button label="Her şeyi sıfırla" onPress={confirmReset} />
    </Screen>
  );
}

function Section(props: { title: string; hint: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <ThemedText type="heading" themeColor="textSecondary">
          {props.title}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {props.hint}
        </ThemedText>
      </View>
      {props.children}
    </View>
  );
}

function StepButton(props: {
  icon: 'plus' | 'minus';
  label: string;
  disabled: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={props.label}
      disabled={props.disabled}
      style={({ pressed }) => [
        styles.stepButton,
        { backgroundColor: theme.backgroundElement },
        (pressed || props.disabled) && styles.dim,
      ]}
      onPress={() => {
        tap();
        props.onPress();
      }}>
      <Icon name={props.icon} size={18} color={theme.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.two + Spacing.one, marginBottom: Spacing.two },
  sectionHeader: { gap: Spacing.one, paddingHorizontal: Spacing.one },
  card: { borderWidth: 1, borderRadius: Radius.large, padding: Spacing.three },
  stepperRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stepper: { flexDirection: 'row', gap: Spacing.two },
  stepButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dim: { opacity: 0.4 },
  patternCard: { gap: Spacing.two + Spacing.one },
  patternRow: { gap: Spacing.one + Spacing.half },
  patternHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  patternDay: { fontWeight: 600 },
  segment: { flexDirection: 'row', borderRadius: Radius.medium, padding: 3, gap: 3 },
  segmentItem: {
    flex: 1,
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.small + 1,
    paddingHorizontal: Spacing.one,
  },
  segmentSelected: { fontWeight: 700 },
  chipGroup: { gap: Spacing.two },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  chip: {
    minHeight: 38,
    justifyContent: 'center',
    paddingHorizontal: Spacing.two + Spacing.one,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  strike: { textDecorationLine: 'line-through' },
});
