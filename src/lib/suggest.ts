import type { IngredientKey, Meal, Protein } from '../data/meals';
import { eligibleMeals, type Rng } from './planner';

export interface SuggestFilters {
  excluded: readonly IngredientKey[];
  /** Boşsa tüm türler */
  proteins: readonly Protein[];
  /** Verilmezse süre sınırı yok */
  maxMinutes?: number;
}

/** Filtrelere (istenmeyen malzemeler, tür, süre) uyan yemekler. */
export function matchingMeals({ excluded, proteins, maxMinutes }: SuggestFilters): Meal[] {
  return eligibleMeals(excluded, proteins.length ? proteins : undefined).filter(
    (m) => maxMinutes === undefined || m.minutes <= maxMinutes,
  );
}

/**
 * "Şimdi ne pişireyim?" için bir öneri: eldeki öneriden farklı, mümkünse bu hafta planda olmayan
 * ve yakın zamanda gösterilmemiş bir yemek. Bunlar tükenince tekrar gösterilenlere izin verilir.
 */
export function suggestMeal(
  filters: SuggestFilters,
  avoid: readonly string[],
  current: string | null,
  rng: Rng = Math.random,
): Meal | null {
  const pool = matchingMeals(filters);
  const others = pool.filter((m) => m.id !== current);
  const fresh = others.filter((m) => !avoid.includes(m.id));
  const pick = (list: Meal[]) => (list.length ? list[Math.floor(rng() * list.length)] : null);
  return pick(fresh) ?? pick(others) ?? pool.find((m) => m.id === current) ?? null;
}
