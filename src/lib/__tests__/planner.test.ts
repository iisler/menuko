import { DEFAULT_PATTERN, INGREDIENTS, MEALS, MEALS_BY_ID, type IngredientKey } from '../../data/meals';
import { buildPlan, eligibleMeals, repairPlan, replaceDay } from '../planner';

/** Tekrarlanabilir testler için basit sözde rastgele üreteç */
function seeded(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

const empty = Array(7).fill(null);
const unlocked = Array(7).fill(false);

describe('yemek verisi', () => {
  it('benzersiz kimliklere sahip', () => {
    expect(new Set(MEALS.map((m) => m.id)).size).toBe(MEALS.length);
  });

  it('her malzemeyi tek bir birimle kullanır', () => {
    const units = new Map<string, Set<string>>();
    for (const meal of MEALS) {
      for (const [key, , unit] of meal.ingredients) {
        expect(INGREDIENTS[key]).toBeDefined();
        if (unit) units.set(key, (units.get(key) ?? new Set()).add(unit));
      }
    }
    for (const set of units.values()) expect(set.size).toBe(1);
  });
});

describe('buildPlan', () => {
  it('düzene uyan, tekrarsız 7 günlük plan üretir', () => {
    for (let seed = 1; seed <= 50; seed++) {
      const plan = buildPlan(empty, unlocked, DEFAULT_PATTERN, [], seeded(seed));
      expect(new Set(plan).size).toBe(7);
      plan.forEach((id, i) => expect(MEALS_BY_ID[id!].protein).toBe(DEFAULT_PATTERN[i]));
    }
  });

  it('kilitli günlere dokunmaz ve onları başka güne tekrar koymaz', () => {
    const first = buildPlan(empty, unlocked, DEFAULT_PATTERN, [], seeded(1));
    const locked = [true, false, false, false, true, false, false];
    for (let seed = 2; seed <= 30; seed++) {
      const next = buildPlan(first, locked, DEFAULT_PATTERN, [], seeded(seed));
      expect(next[0]).toBe(first[0]);
      expect(next[4]).toBe(first[4]);
      expect(new Set(next).size).toBe(7);
    }
  });

  it('istenmeyen malzemeleri içeren yemekleri seçmez', () => {
    const excluded: IngredientKey[] = ['danaKiyma', 'somon', 'domates'];
    for (let seed = 1; seed <= 30; seed++) {
      const plan = buildPlan(empty, unlocked, DEFAULT_PATTERN, excluded, seeded(seed));
      for (const id of plan) {
        const keys = MEALS_BY_ID[id!].ingredients.map(([k]) => k);
        expect(keys.some((k) => excluded.includes(k))).toBe(false);
      }
    }
  });

  it('bir türde uygun yemek kalmayınca başka türe geçer', () => {
    const fish: IngredientKey[] = ['levrek', 'somon', 'cupra', 'hamsi', 'uskumru', 'pisi'];
    expect(eligibleMeals(fish, 'balik')).toHaveLength(0);
    const plan = buildPlan(empty, unlocked, DEFAULT_PATTERN, fish, seeded(3));
    expect(plan.every((id) => id !== null && MEALS_BY_ID[id].protein !== 'balik')).toBe(true);
  });

  it('hiç uygun yemek yoksa günleri boş bırakır', () => {
    const all = Object.keys(INGREDIENTS) as IngredientKey[];
    expect(buildPlan(empty, unlocked, DEFAULT_PATTERN, all)).toEqual(empty);
  });
});

describe('replaceDay', () => {
  it('her zaman farklı ve haftada olmayan bir yemek getirir', () => {
    const plan = buildPlan(empty, unlocked, DEFAULT_PATTERN, [], seeded(7));
    for (let seed = 1; seed <= 50; seed++) {
      const next = replaceDay(plan, 2, 'balik', [], seeded(seed));
      expect(next[2]).not.toBe(plan[2]);
      expect(new Set(next).size).toBe(7);
      expect(MEALS_BY_ID[next[2]!].protein).toBe('balik');
      next.forEach((id, i) => i !== 2 && expect(id).toBe(plan[i]));
    }
  });
});

describe('repairPlan', () => {
  it('yalnızca artık uymayan günleri değiştirir', () => {
    const plan = buildPlan(empty, unlocked, DEFAULT_PATTERN, [], seeded(11));
    const pattern = DEFAULT_PATTERN.map((p, i) => (i === 0 ? 'baklagil' : p));
    const next = repairPlan(plan, unlocked, pattern, [], seeded(5));
    expect(MEALS_BY_ID[next[0]!].protein).toBe('baklagil');
    expect(next.slice(1)).toEqual(plan.slice(1));
    expect(new Set(next).size).toBe(7);
  });

  it('yasaklanan malzemeyi içeren yemeği değiştirir', () => {
    const plan = buildPlan(empty, unlocked, DEFAULT_PATTERN, [], seeded(11));
    const banned = MEALS_BY_ID[plan[1]!].ingredients[0][0];
    const next = repairPlan(plan, unlocked, DEFAULT_PATTERN, [banned], seeded(5));
    for (const id of next) {
      expect(MEALS_BY_ID[id!].ingredients.some(([k]) => k === banned)).toBe(false);
    }
  });
});
