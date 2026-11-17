import { MEALS, MEALS_BY_ID, type IngredientKey } from '../../data/meals';
import { matchingMeals, suggestMeal } from '../suggest';
import { todayLabel } from '../week';

const all = { excluded: [] as IngredientKey[], proteins: [] as const, maxMinutes: undefined };

describe('matchingMeals', () => {
  it('filtre yoksa tüm yemekleri verir', () => {
    expect(matchingMeals({ ...all, proteins: [] })).toHaveLength(MEALS.length);
  });

  it('süre, tür ve istenmeyen malzemeye göre süzer', () => {
    const quick = matchingMeals({ excluded: ['hamsi'], proteins: ['balik'], maxMinutes: 30 });
    expect(quick.length).toBeGreaterThan(0);
    for (const m of quick) {
      expect(m.protein).toBe('balik');
      expect(m.minutes).toBeLessThanOrEqual(30);
      expect(m.id).not.toBe('hamsi-tava');
    }
  });
});

describe('suggestMeal', () => {
  const filters = { excluded: [] as IngredientKey[], proteins: [], maxMinutes: 30 };

  it('mevcut öneriden farklı ve kaçınılacak listede olmayan bir yemek getirir', () => {
    const pool = matchingMeals(filters).map((m) => m.id);
    const avoid = pool.slice(0, 3);
    for (let i = 0; i < 50; i++) {
      const meal = suggestMeal(filters, avoid, pool[3])!;
      expect(pool).toContain(meal.id);
      expect(avoid).not.toContain(meal.id);
      expect(meal.id).not.toBe(pool[3]);
    }
  });

  it('kaçınılacaklar tükenince yine de farklı bir yemek önerir', () => {
    const pool = matchingMeals(filters).map((m) => m.id);
    const meal = suggestMeal(filters, pool, pool[0])!;
    expect(meal.id).not.toBe(pool[0]);
  });

  it('tek uygun yemek varsa onu korur, hiç yoksa boş döner', () => {
    const only = { excluded: [] as IngredientKey[], proteins: ['balik' as const], maxMinutes: 20 };
    expect(matchingMeals(only).map((m) => m.id)).toEqual(['hamsi-tava']);
    expect(suggestMeal(only, [], 'hamsi-tava')?.id).toBe('hamsi-tava');
    expect(suggestMeal({ ...only, maxMinutes: 10 }, [], null)).toBeNull();
  });

  it('önerilen yemekler gerçekten var', () => {
    const meal = suggestMeal({ ...all, proteins: [] }, [], null)!;
    expect(MEALS_BY_ID[meal.id]).toBe(meal);
  });
});

describe('todayLabel', () => {
  it('gün ve tarihi yazar', () => {
    expect(todayLabel(new Date(2026, 10, 17))).toBe('Salı, 17 Kasım');
    expect(todayLabel(new Date(2026, 10, 22))).toBe('Pazar, 22 Kasım');
  });
});
