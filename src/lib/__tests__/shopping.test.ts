import { buildShoppingList, formatAmount, shoppingListText } from '../shopping';
import { todayIndex, weekRangeLabel } from '../week';

const plan = ['dana-sote', 'dana-guvec', 'nohut-yemegi', 'firin-tavuk-but-hardal', null, null, null];
const find = (servings: number, key: string) =>
  buildShoppingList(plan, servings)
    .flatMap((s) => s.items)
    .find((i) => i.key === key);

describe('buildShoppingList', () => {
  it('aynı malzemeyi tek satırda toplar', () => {
    expect(find(3, 'domates')?.amount).toBe('8 adet');
    expect(find(3, 'danaKusbasi')?.amount).toBe('1 kg');
    const names = buildShoppingList(plan, 3).flatMap((s) => s.items.map((i) => i.name));
    expect(new Set(names).size).toBe(names.length);
  });

  it('miktarları kişi sayısına göre ölçekler', () => {
    expect(find(6, 'domates')?.amount).toBe('16 adet');
    expect(find(1, 'domates')?.amount).toBe('3 adet');
    expect(find(4, 'danaKusbasi')?.amount).toBe('1,35 kg');
  });

  it('kavanoz gibi birimleri ölçeklemez', () => {
    expect(find(9, 'hardal')?.amount).toBe('1 kavanoz');
  });

  it('kategorileri sabit sırada verir, boş olanları atlar', () => {
    expect(buildShoppingList(plan, 3).map((s) => s.category)).toEqual([
      'et',
      'sebze',
      'bakliyat',
      'diger',
    ]);
    expect(buildShoppingList(Array(7).fill(null), 3)).toEqual([]);
  });

  it('kiraz domatesi sebze kategorisine koyar', () => {
    const sections = buildShoppingList(['kagitta-cupra'], 3);
    const sebze = sections.find((s) => s.category === 'sebze');
    expect(sebze?.items.map((i) => i.key)).toContain('kirazDomates');
  });
});

describe('formatAmount', () => {
  it('gramı 50’ye yuvarlar ve kilograma çevirir', () => {
    expect(formatAmount(500, 'g', 3)).toBe('500 g');
    expect(formatAmount(500, 'g', 1)).toBe('150 g');
    expect(formatAmount(600, 'g', 5)).toBe('1 kg');
    expect(formatAmount(700, 'g', 5)).toBe('1,15 kg');
  });

  it('adetleri yukarı yuvarlar', () => {
    expect(formatAmount(2, 'adet', 4)).toBe('3 adet');
    expect(formatAmount(6, 'adet', 3)).toBe('6 adet');
  });

  it('sıvıları yarımlık adımlarla verir', () => {
    expect(formatAmount(1, 'L', 4)).toBe('1,5 L');
  });
});

describe('shoppingListText', () => {
  it('işaretli ürünleri ve boşalan kategorileri atlar', () => {
    const sections = buildShoppingList(plan, 3);
    const text = shoppingListText(sections, ['hardal', 'domates']);
    expect(text).toContain('• Dana kuşbaşı — 1 kg');
    expect(text).not.toContain('Domates');
    expect(text).not.toContain('Diğer');
  });
});

describe('hafta', () => {
  it('pazartesiyi haftanın ilk günü sayar', () => {
    expect(todayIndex(new Date(2026, 10, 9))).toBe(0);
    expect(todayIndex(new Date(2026, 10, 15))).toBe(6);
  });

  it('hafta aralığını yazar', () => {
    expect(weekRangeLabel(new Date(2026, 10, 12))).toBe('9–15 Kasım');
    expect(weekRangeLabel(new Date(2026, 11, 2))).toBe('30 Kasım – 6 Aralık');
    expect(weekRangeLabel(new Date(2026, 11, 31))).toBe('28 Aralık – 3 Ocak');
  });
});
