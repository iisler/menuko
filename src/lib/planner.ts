import { MEALS, MEALS_BY_ID, type IngredientKey, type Meal, type Protein } from '../data/meals';

export type Rng = () => number;
export type Plan = (string | null)[];

export function mealUsesAny(meal: Meal, excluded: readonly IngredientKey[]): boolean {
  return meal.ingredients.some(([key]) => excluded.includes(key));
}

export function eligibleMeals(excluded: readonly IngredientKey[], protein?: Protein): Meal[] {
  return MEALS.filter(
    (m) => (protein === undefined || m.protein === protein) && !mealUsesAny(m, excluded),
  );
}

function pickFrom(pool: Meal[], rng: Rng): Meal | null {
  return pool.length ? pool[Math.floor(rng() * pool.length)] : null;
}

/**
 * İstenen protein türünden, haftada henüz kullanılmamış bir yemek seçer.
 * O türde uygun yemek kalmadıysa başka türlere, o da yoksa tekrara izin verir.
 */
export function pickMeal(
  protein: Protein,
  used: readonly string[],
  excluded: readonly IngredientKey[],
  rng: Rng = Math.random,
): Meal | null {
  const unused = (m: Meal) => !used.includes(m.id);
  return (
    pickFrom(eligibleMeals(excluded, protein).filter(unused), rng) ??
    pickFrom(eligibleMeals(excluded).filter(unused), rng) ??
    pickFrom(eligibleMeals(excluded, protein), rng) ??
    pickFrom(eligibleMeals(excluded), rng)
  );
}

/** Kilitli günlere dokunmadan diğer günleri yeniden doldurur. */
export function buildPlan(
  prev: Plan,
  locked: readonly boolean[],
  pattern: readonly Protein[],
  excluded: readonly IngredientKey[],
  rng: Rng = Math.random,
): Plan {
  const used = prev.filter((id, i): id is string => locked[i] && id !== null);
  return pattern.map((protein, i) => {
    if (locked[i] && prev[i]) return prev[i];
    const meal = pickMeal(protein, used, excluded, rng);
    if (meal) used.push(meal.id);
    return meal ? meal.id : null;
  });
}

/** Tek bir günün yemeğini, haftadaki diğer yemeklerden ve mevcut yemekten farklı biriyle değiştirir. */
export function replaceDay(
  plan: Plan,
  day: number,
  protein: Protein,
  excluded: readonly IngredientKey[],
  rng: Rng = Math.random,
): Plan {
  const used = plan.filter((id): id is string => id !== null);
  const candidates = (p?: Protein) => eligibleMeals(excluded, p).filter((m) => !used.includes(m.id));
  const meal = pickFrom(candidates(protein), rng) ?? pickFrom(candidates(), rng);
  if (!meal) return plan;
  return plan.map((id, i) => (i === day ? meal.id : id));
}

/** Ayarlar değiştiğinde artık uygun olmayan (kilitsiz) günleri yeniler. */
export function repairPlan(
  plan: Plan,
  locked: readonly boolean[],
  pattern: readonly Protein[],
  excluded: readonly IngredientKey[],
  rng: Rng = Math.random,
): Plan {
  let next = plan;
  pattern.forEach((protein, i) => {
    if (locked[i] && next[i]) return;
    const meal = next[i] ? MEALS_BY_ID[next[i]] : undefined;
    const fits = meal && meal.protein === protein && !mealUsesAny(meal, excluded);
    if (fits) return;
    const cleared = next.map((id, j) => (j === i ? null : id));
    const replaced = replaceDay(cleared, i, protein, excluded, rng);
    // Uygun yemek bulunamadıysa ve eldeki yemek yasaklı değilse onu koru.
    next = replaced[i] || (meal && mealUsesAny(meal, excluded)) ? replaced : next;
  });
  return next;
}
