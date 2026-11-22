import { MEALS, MEALS_BY_ID, type Meal } from '../meals';
import { ingredientGrams, mealCalories, oilTablespoons, parseSides } from '../nutrition';

describe('mealCalories', () => {
  it('her yemek için makul bir kişi başı kalori verir', () => {
    for (const meal of MEALS) {
      const c = mealCalories(meal);
      expect(Number.isFinite(c.total)).toBe(true);
      expect(c.total).toBe(c.main + c.side);
      expect(c.main).toBeGreaterThanOrEqual(150);
      expect(c.total).toBeLessThanOrEqual(1500);
      expect(c.total % 10).toBe(0);
    }
  });

  it('her malzeme satırının gramı hesaplanabilir', () => {
    for (const meal of MEALS) {
      for (const row of meal.ingredients) {
        expect(() => ingredientGrams(row)).not.toThrow();
      }
    }
  });

  it('tüm eşlikçiler tanınır', () => {
    const unknown = MEALS.flatMap((m) => parseSides(m).unknown.map((s) => `${m.id}: ${s}`));
    expect(unknown).toEqual([]);
  });

  it('elle hesaplanan bir örnekle tutarlıdır', () => {
    // 500 g kontrafile (190 kcal/100 g) + 2 yk yağ + temel malzemeler, 3 kişi:
    // (950 + 238 + 60) / 3 ≈ 416 → 420. Basmati pilavı 220 + mevsim salatası 60.
    expect(mealCalories(MEALS_BY_ID['dana-kontrafile-izgara'])).toEqual({
      main: 420,
      side: 280,
      total: 700,
    });
  });

  it('malzeme listesinde olan eşlikçiyi ikinci kez saymaz', () => {
    const base: Meal = { ...MEALS_BY_ID['dana-kontrafile-izgara'], side: 'Yoğurt' };
    const withYogurt: Meal = { ...base, ingredients: [...base.ingredients, ['yogurt', 500, 'g']] };
    expect(parseSides(base).kcal).toBe(90);
    expect(parseSides(withYogurt).kcal).toBe(0);
  });

  it('pişirme yöntemine göre yağ miktarını ayarlar', () => {
    expect(oilTablespoons(MEALS_BY_ID['izgara-levrek'])).toBe(2);
    expect(oilTablespoons(MEALS_BY_ID['hamsi-tava'])).toBe(5);
    expect(oilTablespoons(MEALS_BY_ID['zeytinyagli-kereviz'])).toBe(6);
  });
});
