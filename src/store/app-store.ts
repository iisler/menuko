import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

import {
  BASE_SERVINGS,
  DEFAULT_PATTERN,
  INGREDIENTS,
  MEALS_BY_ID,
  PROTEINS,
  type DayProteins,
  type IngredientKey,
  type Protein,
} from '../data/meals';
import { buildPlan, repairPlan, replaceDay, type Plan } from '../lib/planner';
import { buildShoppingList } from '../lib/shopping';

const STORAGE_KEY = 'menuko:state:v1';
export const MIN_SERVINGS = 1;
export const MAX_SERVINGS = 10;

export interface AppState {
  plan: Plan;
  locked: boolean[];
  /** Alışveriş listesinde işaretlenmiş malzemeler */
  checked: IngredientKey[];
  servings: number;
  /** Her gün için kabul edilen ana malzeme türleri (en az bir tane) */
  pattern: DayProteins[];
  excluded: IngredientKey[];
}

function freshState(): AppState {
  const locked = Array<boolean>(7).fill(false);
  return {
    plan: buildPlan(Array(7).fill(null), locked, DEFAULT_PATTERN, []),
    locked,
    checked: [],
    servings: BASE_SERVINGS,
    pattern: DEFAULT_PATTERN.map((day) => [...day]),
    excluded: [],
  };
}

let state: AppState = freshState();
const listeners = new Set<() => void>();

/** Plan değişince listede artık olmayan malzemelerin işaretini düşürür. */
function pruneChecked(next: AppState): AppState {
  const present = new Set(
    buildShoppingList(next.plan, next.servings).flatMap((s) => s.items.map((i) => i.key)),
  );
  const checked = next.checked.filter((key) => present.has(key));
  return checked.length === next.checked.length ? next : { ...next, checked };
}

function setState(patch: Partial<AppState>) {
  state = pruneChecked({ ...state, ...patch });
  listeners.forEach((listener) => listener());
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
}

/** Kayıtlı veriyi doğrular; bozuk ya da eski alanlar varsayılana döner. */
export function parseStored(raw: string | null): AppState | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    const isIngredient = (k: unknown): k is IngredientKey => typeof k === 'string' && k in INGREDIENTS;
    const seven = (v: unknown): v is unknown[] => Array.isArray(v) && v.length === 7;
    if (!seven(data.plan) || !seven(data.locked) || !seven(data.pattern)) return null;
    // Eski kayıtlarda her gün tek bir tür (metin) olarak tutuluyordu; yenilerde liste.
    const pattern = data.pattern.map((day: unknown) => {
      const list = Array.isArray(day) ? day : [day];
      return PROTEINS.filter((p) => list.includes(p));
    });
    if (pattern.some((day: Protein[]) => day.length === 0)) return null;
    const plan: Plan = data.plan.map((id: unknown) =>
      typeof id === 'string' && id in MEALS_BY_ID ? id : null,
    );
    const servings = Math.round(Number(data.servings));
    return pruneChecked({
      plan,
      locked: data.locked.map((l: unknown, i: number) => l === true && plan[i] !== null),
      pattern,
      servings:
        servings >= MIN_SERVINGS && servings <= MAX_SERVINGS ? servings : BASE_SERVINGS,
      excluded: Array.isArray(data.excluded) ? data.excluded.filter(isIngredient) : [],
      checked: Array.isArray(data.checked) ? data.checked.filter(isIngredient) : [],
    });
  } catch {
    return null;
  }
}

export async function hydrate(): Promise<void> {
  const stored = parseStored(await AsyncStorage.getItem(STORAGE_KEY).catch(() => null));
  if (stored) {
    state = stored;
    listeners.forEach((listener) => listener());
  }
}

export const actions = {
  shuffle() {
    setState({ plan: buildPlan(state.plan, state.locked, state.pattern, state.excluded) });
  },
  changeDay(day: number) {
    setState({ plan: replaceDay(state.plan, day, state.pattern[day], state.excluded) });
  },
  /**
   * Bir güne belirli bir yemeği koyar. Yemek haftanın kilitsiz başka bir gününde varsa
   * iki gün yer değiştirir; böylece aynı yemek iki kez çıkmaz.
   */
  setDayMeal(day: number, mealId: string) {
    if (!(mealId in MEALS_BY_ID) || state.locked[day] || state.plan[day] === mealId) return;
    const other = state.plan.findIndex((id, i) => i !== day && id === mealId && !state.locked[i]);
    const plan = state.plan.map((id, i) =>
      i === day ? mealId : i === other ? state.plan[day] : id,
    );
    setState({ plan });
  },
  toggleLock(day: number) {
    if (!state.plan[day]) return;
    setState({ locked: state.locked.map((l, i) => (i === day ? !l : l)) });
  },
  toggleChecked(key: IngredientKey) {
    const checked = state.checked.includes(key)
      ? state.checked.filter((k) => k !== key)
      : [...state.checked, key];
    setState({ checked });
  },
  clearChecked() {
    setState({ checked: [] });
  },
  setServings(servings: number) {
    setState({ servings: Math.min(MAX_SERVINGS, Math.max(MIN_SERVINGS, servings)) });
  },
  /** Günün türlerini açıp kapatır; en az bir tür seçili kalmalıdır. */
  toggleDayProtein(day: number, protein: Protein) {
    const current = state.pattern[day];
    const next = current.includes(protein)
      ? current.filter((p) => p !== protein)
      : PROTEINS.filter((p) => p === protein || current.includes(p));
    if (next.length === 0) return;
    const pattern = state.pattern.map((p, i) => (i === day ? next : p));
    setState({ pattern, plan: repairPlan(state.plan, state.locked, pattern, state.excluded) });
  },
  toggleExcluded(key: IngredientKey) {
    const excluded = state.excluded.includes(key)
      ? state.excluded.filter((k) => k !== key)
      : [...state.excluded, key];
    // Yasaklanan malzemeyi içeren yemek kilitli olsa bile değişmeli.
    const locked = state.locked.map((l, i) => {
      const meal = state.plan[i] ? MEALS_BY_ID[state.plan[i]] : undefined;
      return l && !meal?.ingredients.some(([k]) => excluded.includes(k));
    });
    setState({ excluded, locked, plan: repairPlan(state.plan, locked, state.pattern, excluded) });
  },
  reset() {
    setState(freshState());
  },
};

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => state;

/** Testler için anlık durum. */
export const getState = getSnapshot;

export function useAppState(): AppState {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
