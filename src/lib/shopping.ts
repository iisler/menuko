import {
  BASE_SERVINGS,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  INGREDIENTS,
  MEALS_BY_ID,
  type Category,
  type IngredientKey,
  type Unit,
} from '../data/meals';
import type { Plan } from './planner';

export interface ShoppingItem {
  key: IngredientKey;
  name: string;
  /** "1,2 kg", "5 adet" gibi; miktarı olmayan malzemelerde boş */
  amount: string;
}

export interface ShoppingSection {
  category: Category;
  title: string;
  items: ShoppingItem[];
}

/** Kişi sayısına göre ölçeklenmeyen birimler (bir kavanoz hardal herkese yeter). */
const FIXED_UNITS: Unit[] = ['demet', 'kavanoz'];

function tr(n: number): string {
  return String(n).replace('.', ',');
}

export function formatAmount(qty: number, unit: Unit, servings: number): string {
  const scaled = FIXED_UNITS.includes(unit) ? qty : (qty * servings) / BASE_SERVINGS;
  switch (unit) {
    case 'g': {
      const grams = Math.max(50, Math.round(scaled / 50) * 50);
      return grams >= 1000 ? `${tr(grams / 1000)} kg` : `${grams} g`;
    }
    case 'L':
    case 'su bardağı':
      return `${tr(Math.max(0.5, Math.round(scaled * 2) / 2))} ${unit}`;
    default:
      return `${Math.max(1, Math.ceil(scaled - 1e-9))} ${unit}`;
  }
}

/** Plandaki yemeklerin malzemelerini birleştirip kategorilere ayırır. */
export function buildShoppingList(plan: Plan, servings: number): ShoppingSection[] {
  const totals = new Map<IngredientKey, { qty: number; unit?: Unit }>();
  for (const id of plan) {
    const meal = id ? MEALS_BY_ID[id] : undefined;
    if (!meal) continue;
    for (const [key, qty, unit] of meal.ingredients) {
      const entry = totals.get(key) ?? { qty: 0, unit };
      entry.qty += qty ?? 0;
      entry.unit ??= unit;
      totals.set(key, entry);
    }
  }

  return CATEGORY_ORDER.map((category) => ({
    category,
    title: CATEGORY_LABELS[category],
    items: [...totals.entries()]
      .filter(([key]) => INGREDIENTS[key].category === category)
      .map(([key, { qty, unit }]) => ({
        key,
        name: INGREDIENTS[key].name,
        amount: unit && qty > 0 ? formatAmount(qty, unit, servings) : '',
      }))
      .sort((a, b) => a.name.localeCompare(b.name, 'tr')),
  })).filter((section) => section.items.length > 0);
}

/** Paylaşmak için düz metin; alınmış (işaretli) ürünler dahil edilmez. */
export function shoppingListText(sections: ShoppingSection[], checked: readonly string[]): string {
  const blocks = sections
    .map((section) => {
      const lines = section.items
        .filter((item) => !checked.includes(item.key))
        .map((item) => `• ${item.name}${item.amount ? ` — ${item.amount}` : ''}`);
      return lines.length ? `${section.title}\n${lines.join('\n')}` : '';
    })
    .filter(Boolean);
  return blocks.length ? `Alışveriş listesi\n\n${blocks.join('\n\n')}` : '';
}
