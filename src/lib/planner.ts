import { MEALS, MEALS_BY_ID, type IngredientKey, type Meal, type Protein } from '../data/meals';

export type Rng = () => number;
export type Plan = (string | null)[];
/** Her gün için kabul edilen ana malzeme türleri (en az bir tane). */
export type Pattern = readonly (readonly Protein[])[];

export function mealUsesAny(meal: Meal, excluded: readonly IngredientKey[]): boolean {
  return meal.ingredients.some(([key]) => excluded.includes(key));
}

export function eligibleMeals(excluded: readonly IngredientKey[], proteins?: readonly Protein[]): Meal[] {
  return MEALS.filter(
    (m) => (proteins === undefined || proteins.includes(m.protein)) && !mealUsesAny(m, excluded),
  );
}

function pickFrom(pool: Meal[], rng: Rng): Meal | null {
  return pool.length ? pool[Math.floor(rng() * pool.length)] : null;
}

/**
 * Önce havuzda yemeği olan türler arasından eşit olasılıkla bir tür, sonra o türden bir yemek seçer.
 * (Doğrudan yemek seçmek, yemeği çok olan türü öne çıkarırdı.)
 */
function pickByProtein(proteins: readonly Protein[], pool: Meal[], rng: Rng): Meal | null {
  const available = proteins.filter((p) => pool.some((m) => m.protein === p));
  if (!available.length) return null;
  const protein = available[Math.floor(rng() * available.length)];
  return pickFrom(
    pool.filter((m) => m.protein === protein),
    rng,
  );
}

/**
 * Günün türlerinden birine ait, haftada henüz kullanılmamış bir yemek seçer.
 * O türlerde uygun yemek kalmadıysa başka türlere, o da yoksa tekrara izin verir.
 */
export function pickMeal(
  proteins: readonly Protein[],
  used: readonly string[],
  excluded: readonly IngredientKey[],
  rng: Rng = Math.random,
): Meal | null {
  const all = eligibleMeals(excluded);
  const unused = all.filter((m) => !used.includes(m.id));
  return (
    pickByProtein(proteins, unused, rng) ??
    pickFrom(unused, rng) ??
    pickByProtein(proteins, all, rng) ??
    pickFrom(all, rng)
  );
}

/** Kilitli günlere dokunmadan diğer günleri yeniden doldurur. */
export function buildPlan(
  prev: Plan,
  locked: readonly boolean[],
  pattern: Pattern,
  excluded: readonly IngredientKey[],
  rng: Rng = Math.random,
): Plan {
  const used = prev.filter((id, i): id is string => locked[i] && id !== null);
  return pattern.map((proteins, i) => {
    if (locked[i] && prev[i]) return prev[i];
    const meal = pickMeal(proteins, used, excluded, rng);
    if (meal) used.push(meal.id);
    return meal ? meal.id : null;
  });
}

/** Tek bir günün yemeğini, haftadaki diğer yemeklerden ve mevcut yemekten farklı biriyle değiştirir. */
export function replaceDay(
  plan: Plan,
  day: number,
  proteins: readonly Protein[],
  excluded: readonly IngredientKey[],
  rng: Rng = Math.random,
): Plan {
  const used = plan.filter((id): id is string => id !== null);
  const unused = eligibleMeals(excluded).filter((m) => !used.includes(m.id));
  const meal = pickByProtein(proteins, unused, rng) ?? pickFrom(unused, rng);
  if (!meal) return plan;
  return plan.map((id, i) => (i === day ? meal.id : id));
}

/** Ayarlar değiştiğinde artık uygun olmayan (kilitsiz) günleri yeniler; uyanlara dokunmaz. */
export function repairPlan(
  plan: Plan,
  locked: readonly boolean[],
  pattern: Pattern,
  excluded: readonly IngredientKey[],
  rng: Rng = Math.random,
): Plan {
  let next = plan;
  pattern.forEach((proteins, i) => {
    if (locked[i] && next[i]) return;
    const meal = next[i] ? MEALS_BY_ID[next[i]] : undefined;
    const fits = meal && proteins.includes(meal.protein) && !mealUsesAny(meal, excluded);
    if (fits) return;
    const cleared = next.map((id, j) => (j === i ? null : id));
    const replaced = replaceDay(cleared, i, proteins, excluded, rng);
    // Uygun yemek bulunamadıysa ve eldeki yemek yasaklı değilse onu koru.
    next = replaced[i] || (meal && mealUsesAny(meal, excluded)) ? replaced : next;
  });
  return next;
}
