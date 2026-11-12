import { SymbolView } from 'expo-symbols';
import type { ComponentProps } from 'react';
import type { ColorValue } from 'react-native';

type SymbolName = ComponentProps<typeof SymbolView>['name'];

const ICONS = {
  shuffle: { ios: 'shuffle', android: 'shuffle', web: 'shuffle' },
  swap: { ios: 'arrow.triangle.2.circlepath', android: 'refresh', web: 'refresh' },
  lock: { ios: 'lock.fill', android: 'lock', web: 'lock' },
  unlock: { ios: 'lock.open', android: 'lock_open', web: 'lock_open' },
  clock: { ios: 'clock', android: 'schedule', web: 'schedule' },
  play: { ios: 'play.rectangle.fill', android: 'smart_display', web: 'smart_display' },
  share: { ios: 'square.and.arrow.up', android: 'share', web: 'share' },
  check: { ios: 'checkmark', android: 'check', web: 'check' },
  plus: { ios: 'plus', android: 'add', web: 'add' },
  minus: { ios: 'minus', android: 'remove', web: 'remove' },
} satisfies Record<string, SymbolName>;

export type IconName = keyof typeof ICONS;

export function Icon({ name, size = 16, color }: { name: IconName; size?: number; color: ColorValue }) {
  return <SymbolView name={ICONS[name]} size={size} tintColor={color} />;
}
