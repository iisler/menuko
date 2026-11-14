import * as Haptics from 'expo-haptics';

/** Hafif dokunsal geri bildirim; desteklenmeyen platformlarda sessizce geçer. */
export function tap() {
  if (process.env.EXPO_OS === 'web') return;
  Haptics.selectionAsync().catch(() => {});
}
