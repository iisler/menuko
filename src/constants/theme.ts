import '@/global.css';

import { Platform } from 'react-native';

import type { Protein } from '@/data/meals';

export const Colors = {
  light: {
    text: '#1F1B16',
    textSecondary: '#6B645B',
    background: '#FAF7F2',
    card: '#FFFFFF',
    backgroundElement: '#F1ECE4',
    backgroundSelected: '#E6DFD3',
    border: '#E7E0D5',
    tint: '#C8481F',
    onTint: '#FFFFFF',
    tintSoft: '#FBE9E1',
  },
  dark: {
    text: '#F5F1EA',
    textSecondary: '#A8A096',
    background: '#12100E',
    card: '#1D1A17',
    backgroundElement: '#26221E',
    backgroundSelected: '#35302A',
    border: '#2E2A25',
    tint: '#FF8A5C',
    onTint: '#2A0F04',
    tintSoft: '#3A1E12',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const ProteinColors: Record<
  'light' | 'dark',
  Record<Protein, { background: string; text: string }>
> = {
  light: {
    dana: { background: '#FAECE7', text: '#993C1D' },
    tavuk: { background: '#FAEEDA', text: '#854F0B' },
    balik: { background: '#E6F1FB', text: '#185FA5' },
    baklagil: { background: '#EAF3DE', text: '#3B6D11' },
  },
  dark: {
    dana: { background: '#3A1E14', text: '#F0A58A' },
    tavuk: { background: '#382A10', text: '#EBC078' },
    balik: { background: '#12283D', text: '#8FC1F0' },
    baklagil: { background: '#1E2E12', text: '#A9D382' },
  },
};

export const Fonts = Platform.select({
  ios: { sans: 'system-ui', rounded: 'ui-rounded' },
  default: { sans: 'normal', rounded: 'normal' },
  web: { sans: 'var(--font-display)', rounded: 'var(--font-rounded)' },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = { small: 8, medium: 12, large: 18, pill: 999 } as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 640;
