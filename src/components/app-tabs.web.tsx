import {
  TabList,
  TabSlot,
  TabTrigger,
  Tabs,
  type TabListProps,
  type TabTriggerSlotProps,
} from 'expo-router/ui';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        {/* Sekmeler TabList'in doğrudan alt öğesinin çocukları olmalı; yoksa rotalar kaydedilmez. */}
        <TabBar>
          <TabTrigger name="index" href="/" asChild>
            <TabButton>Bugün</TabButton>
          </TabTrigger>
          <TabTrigger name="plan" href="/plan" asChild>
            <TabButton>Plan</TabButton>
          </TabTrigger>
          <TabTrigger name="shopping" href="/shopping" asChild>
            <TabButton>Alışveriş</TabButton>
          </TabTrigger>
          <TabTrigger name="settings" href="/settings" asChild>
            <TabButton>Ayarlar</TabButton>
          </TabTrigger>
        </TabBar>
      </TabList>
    </Tabs>
  );
}

function TabBar(props: TabListProps) {
  const theme = useTheme();
  // Dar ekranda dört sekmeye yer açmak için marka yazısı gizlenir.
  const showBrand = useWindowDimensions().width >= 480;
  return (
    <View {...props} style={[styles.bar, { backgroundColor: theme.background }]}>
      <View style={[styles.inner, { backgroundColor: theme.card, borderColor: theme.border }]}>
        {showBrand ? (
          <ThemedText type="bodyBold" themeColor="tint" style={styles.brand}>
            Menuko
          </ThemedText>
        ) : null}
        {props.children}
      </View>
    </View>
  );
}

function TabButton({ children, isFocused, ref: _ref, ...props }: TabTriggerSlotProps) {
  const theme = useTheme();
  return (
    <Pressable
      {...props}
      style={[styles.tab, isFocused && { backgroundColor: theme.tintSoft }]}>
      <ThemedText type="smallBold" themeColor={isFocused ? 'tint' : 'textSecondary'}>
        {children}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    top: 0,
    width: '100%',
    padding: Spacing.three,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  inner: {
    flexGrow: 1,
    maxWidth: MaxContentWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.one,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.large,
    borderWidth: 1,
  },
  brand: { marginRight: 'auto' },
  tab: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two + Spacing.one,
    borderRadius: Radius.medium,
  },
});
