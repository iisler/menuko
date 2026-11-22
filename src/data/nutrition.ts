import { BASE_SERVINGS, type IngredientKey, type Meal, type Unit } from '@/data/meals';

/**
 * Kalori tahmini.
 *
 * Bir yemeğin porsiyon kalorisi üç parçadan hesaplanır:
 *   1. Malzemeler: listedeki her malzemenin gramı × 100 g'daki kalorisi.
 *   2. Mutfak temelleri: listeye yazılmayan yağ, soğan, salça. Yağ miktarı pişirme
 *      yöntemine göre tahmin edilir (ızgara az, kızartma ve zeytinyağlı çok).
 *   3. Yanındakiler: `side` alanındaki pilav, salata, yoğurt gibi eşlikçiler.
 *      Malzeme listesinde zaten bulunan bir eşlikçi ikinci kez sayılmaz.
 * (1) ve (2) toplamı BASE_SERVINGS kişiliktir, kişi başına bölünür.
 *
 * Değerler USDA FoodData Central (SR Legacy) ve TürKomp'taki çiğ / kuru
 * ağırlık değerlerine dayanır. Sonuç bir tahmindir; tarif, porsiyon ve
 * marka farkı ±%15-20 sapma yaratabilir.
 */

interface Nutrient {
  /** 100 g'daki kalori (kcal), çiğ / kuru hâli */
  kcal: number;
  /** Birim başına yenilebilir gram (ör. 1 adet levrek ≈ 200 g fileto). Kavanoz ve kutu için tarifte kullanılan miktar. */
  per?: Partial<Record<Unit, number>>;
  /** Miktar yazılmamışsa tarifte kullanıldığı varsayılan gram */
  default?: number;
  /** Gramla alınan bütün balık / kemikli et için yenilebilir oran */
  edible?: number;
}

export const NUTRITION = {
  // ——— Et & Balık ———
  danaKontrafile: { kcal: 190 },
  danaKusbasi: { kcal: 170 },
  danaKiyma: { kcal: 230 },
  danaBonfile: { kcal: 170 },
  tavukGogsu: { kcal: 120 },
  tavukBut: { kcal: 214, per: { adet: 120 } },
  tavukKiyma: { kcal: 143 },
  tavukKanat: { kcal: 222, edible: 0.7 },
  hindiGogsu: { kcal: 114 },
  levrek: { kcal: 97, per: { adet: 200 } },
  somon: { kcal: 208 },
  cupra: { kcal: 120, per: { adet: 180 } },
  hamsi: { kcal: 131, edible: 0.65 },
  uskumru: { kcal: 205, per: { adet: 180 } },
  pisi: { kcal: 70, edible: 0.6 },
  palamut: { kcal: 140, per: { adet: 350 } },
  mezgit: { kcal: 90 },
  alabalik: { kcal: 141, per: { adet: 180 } },
  karides: { kcal: 85 },
  lufer: { kcal: 124, per: { adet: 250 } },
  tonBalik: { kcal: 198, per: { kutu: 115 } },
  sardalya: { kcal: 140, edible: 0.6 },

  // ——— Sebze & Meyve ———
  renkliBiber: { kcal: 31, per: { adet: 160 } },
  dolmalikBiber: { kcal: 20, per: { adet: 120 } },
  domates: { kcal: 18, per: { adet: 150 } },
  kirazDomates: { kcal: 18 },
  patates: { kcal: 77, per: { adet: 180 } },
  kabak: { kcal: 17, per: { adet: 200 } },
  havuc: { kcal: 41, per: { adet: 80 } },
  kerevizSapi: { kcal: 16, default: 50 },
  tazeFasulye: { kcal: 31 },
  roka: { kcal: 25, default: 80 },
  maydanoz: { kcal: 36, per: { demet: 50 }, default: 30 },
  dereotu: { kcal: 43, default: 20 },
  nane: { kcal: 44, default: 10 },
  tazeKekik: { kcal: 101, default: 5 },
  limon: { kcal: 22, per: { adet: 50 } }, // suyu
  patlican: { kcal: 25, per: { adet: 220 } },
  ispanak: { kcal: 23 },
  pirasa: { kcal: 61 },
  lahana: { kcal: 25, per: { adet: 1000 } },
  karnabahar: { kcal: 25, per: { adet: 800 } },
  brokoli: { kcal: 34, per: { adet: 400 } },
  bezelye: { kcal: 81 },
  enginar: { kcal: 47, per: { adet: 80 } }, // temizlenmiş çanak
  bamya: { kcal: 33 },
  mantar: { kcal: 22 },
  kereviz: { kcal: 42, per: { adet: 500 } },
  balkabagi: { kcal: 26 },
  marul: { kcal: 15, per: { adet: 400 } },
  misir: { kcal: 81, per: { kutu: 150 } },

  // ——— Bakliyat & Kuru Gıda (kuru ağırlık) ———
  nohut: { kcal: 139, per: { kutu: 240 } }, // haşlanmış, süzülmüş
  yesilMercimek: { kcal: 352 },
  kirmiziMercimek: { kcal: 358 },
  kuruFasulye: { kcal: 333 },
  bulgur: { kcal: 342, per: { 'su bardağı': 160 }, default: 100 },
  pirinc: { kcal: 360, per: { 'su bardağı': 180 } },
  sehriye: { kcal: 371, default: 50 },
  makarna: { kcal: 371 },
  eriste: { kcal: 384 },
  misirUnu: { kcal: 365, default: 50 },
  lavas: { kcal: 275, per: { adet: 70 } },
  ceviz: { kcal: 654, default: 50 },
  kuruUzum: { kcal: 299, default: 30 },
  tahin: { kcal: 595, per: { kavanoz: 60 } },
  sumak: { kcal: 240, default: 5 },
  kimyon: { kcal: 375, default: 3 },
  zerdecal: { kcal: 312, default: 3 },
  kuruNane: { kcal: 285, default: 3 },

  // ——— Süt Ürünleri & Yumurta ———
  yogurt: { kcal: 61 },
  ayran: { kcal: 36, per: { L: 1000 } },
  yumurta: { kcal: 143, per: { adet: 50 } },
  kasar: { kcal: 360 },
  beyazPeynir: { kcal: 264 },
  sut: { kcal: 61, per: { L: 1000 } },
  krema: { kcal: 195, per: { kutu: 200 } },

  // ——— Diğer ———
  hardal: { kcal: 66, per: { kavanoz: 30 } },
  kapari: { kcal: 23, per: { kavanoz: 30 } },
  narEksisi: { kcal: 260, per: { kavanoz: 30 } },
  pisirmeKagidi: { kcal: 0 },
} as const satisfies Record<IngredientKey, Nutrient>;

/** 1 yemek kaşığı zeytinyağı ≈ 13,5 g ≈ 119 kcal */
const KCAL_PER_TBSP_OIL = 119;
/** Soğan, sarımsak, salça: tarif başına */
const KCAL_STAPLES = 60;

/** Pişirme yöntemine göre tarifte (BASE_SERVINGS kişi) kullanılan yağ, yemek kaşığı. */
export function oilTablespoons(meal: Meal): number {
  const name = meal.main.toLocaleLowerCase('tr');
  const has = (...words: string[]) => words.some((w) => name.includes(w));
  if (has('zeytinyağlı', 'imam bayıldı', 'pilaki')) return 6;
  if (has('tava', 'karnıyarık', 'şakşuka', 'mücver', 'kadınbudu', 'çökertme')) return 5;
  if (has('ızgara', 'izgara', 'haşlama', 'buğulama', 'çorba', 'şiş', 'kağıt')) return 2;
  return 3;
}

/** Bir malzeme satırının tarif içindeki gramı. */
export function ingredientGrams([key, qty, unit]: Meal['ingredients'][number]): number {
  const n: Nutrient = NUTRITION[key];
  if (qty === undefined) return n.default ?? 0;
  if (unit === undefined || unit === 'g') return qty * (n.edible ?? 1);
  const per = n.per?.[unit];
  if (per === undefined) {
    throw new Error(`${key} için "${unit}" biriminin gramı tanımlı değil`);
  }
  return qty * per;
}

interface Side {
  /** Eşleşme için küçük harfli anahtar kelimeler; ilk eşleşen kazanır. */
  match: string[];
  /** Porsiyon kalorisi (sos / yağ dahil) */
  kcal: number;
  /** Bu malzemelerden biri yemeğin listesindeyse eşlikçi zaten sayılmıştır. */
  covers?: IngredientKey[];
}

/** Sıra önemli: daha özel olan önce gelir (ör. "bulgur pilavı" "pilav"dan önce). */
const SIDES: Side[] = [
  { match: ['pilav ya da makarna'], kcal: 250 },
  { match: ['bulgur pilavı'], kcal: 200 },
  { match: ['bulgur tabboulesi', 'bulgur salatası'], kcal: 180 },
  { match: ['pilav'], kcal: 220 },
  { match: ['makarna'], kcal: 280, covers: ['makarna'] },
  { match: ['fırın patates'], kcal: 200, covers: ['patates'] },
  { match: ['fırın domates'], kcal: 50, covers: ['domates', 'kirazDomates'] },
  { match: ['ızgara kabak'], kcal: 40, covers: ['kabak'] },
  { match: ['ekmek'], kcal: 150 },
  { match: ['cacık'], kcal: 80, covers: ['yogurt'] },
  { match: ['yoğurt'], kcal: 90, covers: ['yogurt'] },
  { match: ['ayran'], kcal: 90, covers: ['ayran'] },
  { match: ['roka-domates salatası', 'roka salatası'], kcal: 50 },
  { match: ['bol yeşil salata'], kcal: 70 },
  { match: ['salata'], kcal: 60 },
  { match: ['roka'], kcal: 20, covers: ['roka'] },
  { match: ['marul'], kcal: 15, covers: ['marul'] },
  { match: ['zeytin'], kcal: 50 },
  { match: ['turşu'], kcal: 10 },
  { match: ['maydanoz'], kcal: 5, covers: ['maydanoz'] },
  { match: ['limon'], kcal: 0 },
];

/** `side` metnindeki eşlikçileri ayırır. Tanınmayanlar `unknown` içinde döner. */
export function parseSides(meal: Meal): { kcal: number; unknown: string[] } {
  const keys = new Set<IngredientKey>(meal.ingredients.map(([k]) => k));
  let kcal = 0;
  const unknown: string[] = [];
  for (const raw of meal.side.split(',')) {
    const part = raw.trim().toLocaleLowerCase('tr');
    if (!part) continue;
    const side = SIDES.find((s) => s.match.some((m) => part.includes(m)));
    if (!side) {
      unknown.push(raw.trim());
      continue;
    }
    if (side.covers?.some((k) => keys.has(k))) continue;
    kcal += side.kcal;
  }
  return { kcal, unknown };
}

export interface Calories {
  /** Ana yemek, kişi başı */
  main: number;
  /** Yanındakiler, kişi başı */
  side: number;
  /** Toplam, kişi başı; 10'a yuvarlanmış */
  total: number;
}

const round10 = (n: number) => Math.round(n / 10) * 10;

/** Bir öğünün kişi başı tahmini kalorisi. */
export function mealCalories(meal: Meal): Calories {
  const ingredients = meal.ingredients.reduce(
    (sum, row) => sum + (ingredientGrams(row) * NUTRITION[row[0]].kcal) / 100,
    0,
  );
  const recipe = ingredients + oilTablespoons(meal) * KCAL_PER_TBSP_OIL + KCAL_STAPLES;
  const main = round10(recipe / BASE_SERVINGS);
  const side = round10(parseSides(meal).kcal);
  return { main, side, total: main + side };
}

const cache = new Map<string, Calories>();

/** `mealCalories` ile aynı, sonucu yemek kimliğine göre saklar. */
export function caloriesOf(meal: Meal): Calories {
  let c = cache.get(meal.id);
  if (!c) {
    c = mealCalories(meal);
    cache.set(meal.id, c);
  }
  return c;
}
