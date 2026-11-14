import { Pressable, Share, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Icon } from '@/components/icon';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { tap } from '@/lib/haptics';
import { buildShoppingList, shoppingListText } from '@/lib/shopping';
import { actions, useAppState } from '@/store/app-store';

export default function ShoppingScreen() {
  const theme = useTheme();
  const { plan, servings, checked } = useAppState();
  const sections = buildShoppingList(plan, servings);
  const total = sections.reduce((sum, section) => sum + section.items.length, 0);
  const remaining = total - checked.length;

  const subtitle =
    total === 0
      ? `${servings} kişilik`
      : remaining === 0
        ? 'Hepsi alındı'
        : `${servings} kişilik · ${remaining} ürün kaldı`;

  return (
    <Screen
      title="Alışveriş"
      subtitle={subtitle}
      action={
        <Button
          label="Paylaş"
          icon="share"
          variant="primary"
          disabled={remaining === 0}
          onPress={() => {
            Share.share({ message: shoppingListText(sections, checked) }).catch(() => {});
          }}
        />
      }>
      {total === 0 ? (
        <ThemedText themeColor="textSecondary">
          Planda yemek olmadığı için liste boş. Plan sekmesinden haftayı oluşturabilirsiniz.
        </ThemedText>
      ) : null}

      {sections.map((section) => (
        <View key={section.category} style={styles.section}>
          <ThemedText type="heading" themeColor="textSecondary" style={styles.sectionTitle}>
            {section.title}
          </ThemedText>
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            {section.items.map((item, index) => {
              const isChecked = checked.includes(item.key);
              return (
                <Pressable
                  key={item.key}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: isChecked }}
                  accessibilityLabel={`${item.name} ${item.amount}`}
                  style={({ pressed }) => [
                    styles.item,
                    index > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.border },
                    pressed && styles.pressed,
                  ]}
                  onPress={() => {
                    tap();
                    actions.toggleChecked(item.key);
                  }}>
                  <View
                    style={[
                      styles.checkbox,
                      { borderColor: isChecked ? theme.tint : theme.backgroundSelected },
                      isChecked && { backgroundColor: theme.tint },
                    ]}>
                    {isChecked ? <Icon name="check" size={14} color={theme.onTint} /> : null}
                  </View>
                  <ThemedText
                    themeColor={isChecked ? 'textSecondary' : 'text'}
                    style={[styles.itemName, isChecked && styles.strike]}>
                    {item.name}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {item.amount}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}

      {checked.length > 0 ? (
        <Button label="İşaretleri temizle" onPress={actions.clearChecked} />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.two },
  sectionTitle: { paddingHorizontal: Spacing.one },
  card: { borderWidth: 1, borderRadius: Radius.large, paddingHorizontal: Spacing.three },
  item: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two + Spacing.one,
    paddingVertical: Spacing.two,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: Radius.small,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemName: { flex: 1 },
  strike: { textDecorationLine: 'line-through' },
  pressed: { opacity: 0.6 },
});
