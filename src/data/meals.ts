export type Protein = 'dana' | 'tavuk' | 'balik' | 'baklagil';
export type Category = 'et' | 'sebze' | 'bakliyat' | 'sut' | 'diger';
export type Unit = 'g' | 'adet' | 'kutu' | 'L' | 'su bardağı' | 'demet' | 'kavanoz';

export const PROTEINS: Protein[] = ['dana', 'tavuk', 'balik', 'baklagil'];

export const PROTEIN_LABELS: Record<Protein, string> = {
  dana: 'Dana',
  tavuk: 'Tavuk',
  balik: 'Balık',
  baklagil: 'Baklagil',
};

export const CATEGORY_ORDER: Category[] = ['et', 'sebze', 'bakliyat', 'sut', 'diger'];

export const CATEGORY_LABELS: Record<Category, string> = {
  et: 'Et & Balık',
  sebze: 'Sebze & Meyve',
  bakliyat: 'Bakliyat & Kuru Gıda',
  sut: 'Süt Ürünleri & Yumurta',
  diger: 'Diğer',
};

/** Malzeme kataloğu. Her malzemenin tek bir adı ve kategorisi vardır. */
export const INGREDIENTS = {
  danaKontrafile: { name: 'Dana kontrafile', category: 'et' },
  danaKusbasi: { name: 'Dana kuşbaşı', category: 'et' },
  danaKiyma: { name: 'Dana kıyma', category: 'et' },
  danaBonfile: { name: 'Dana bonfile', category: 'et' },
  tavukGogsu: { name: 'Tavuk göğsü', category: 'et' },
  tavukBut: { name: 'Tavuk but', category: 'et' },
  tavukKiyma: { name: 'Tavuk kıyma', category: 'et' },
  levrek: { name: 'Levrek', category: 'et' },
  somon: { name: 'Somon fileto', category: 'et' },
  cupra: { name: 'Çupra', category: 'et' },
  hamsi: { name: 'Hamsi', category: 'et' },
  uskumru: { name: 'Uskumru', category: 'et' },
  pisi: { name: 'Pisi balığı', category: 'et' },

  renkliBiber: { name: 'Renkli biber', category: 'sebze' },
  dolmalikBiber: { name: 'Dolmalık biber', category: 'sebze' },
  domates: { name: 'Domates', category: 'sebze' },
  kirazDomates: { name: 'Kiraz domates', category: 'sebze' },
  patates: { name: 'Patates', category: 'sebze' },
  kabak: { name: 'Kabak', category: 'sebze' },
  havuc: { name: 'Havuç', category: 'sebze' },
  kerevizSapi: { name: 'Kereviz sapı', category: 'sebze' },
  tazeFasulye: { name: 'Taze fasulye', category: 'sebze' },
  roka: { name: 'Roka', category: 'sebze' },
  maydanoz: { name: 'Maydanoz', category: 'sebze' },
  dereotu: { name: 'Dereotu', category: 'sebze' },
  nane: { name: 'Taze nane', category: 'sebze' },
  tazeKekik: { name: 'Taze kekik', category: 'sebze' },
  limon: { name: 'Limon', category: 'sebze' },

  nohut: { name: 'Haşlanmış nohut', category: 'bakliyat' },
  yesilMercimek: { name: 'Yeşil mercimek', category: 'bakliyat' },
  bulgur: { name: 'Bulgur', category: 'bakliyat' },
  pirinc: { name: 'Pirinç', category: 'bakliyat' },
  sehriye: { name: 'Şehriye', category: 'bakliyat' },
  misirUnu: { name: 'Mısır unu', category: 'bakliyat' },
  ceviz: { name: 'Ceviz', category: 'bakliyat' },
  kuruUzum: { name: 'Kuru üzüm', category: 'bakliyat' },
  tahin: { name: 'Tahin', category: 'bakliyat' },
  sumak: { name: 'Sumak', category: 'bakliyat' },
  kimyon: { name: 'Kimyon', category: 'bakliyat' },
  zerdecal: { name: 'Zerdeçal', category: 'bakliyat' },
  kuruNane: { name: 'Kuru nane', category: 'bakliyat' },

  yogurt: { name: 'Yoğurt', category: 'sut' },
  ayran: { name: 'Ayran', category: 'sut' },
  yumurta: { name: 'Yumurta', category: 'sut' },

  hardal: { name: 'Hardal', category: 'diger' },
  kapari: { name: 'Kapari', category: 'diger' },
  pisirmeKagidi: { name: 'Pişirme kağıdı', category: 'diger' },
} as const satisfies Record<string, { name: string; category: Category }>;

export type IngredientKey = keyof typeof INGREDIENTS;

/** [malzeme, miktar, birim]. Miktarlar BASE_SERVINGS kişi içindir. */
export type MealIngredient = [key: IngredientKey, qty?: number, unit?: Unit];

export interface Meal {
  id: string;
  protein: Protein;
  main: string;
  side: string;
  minutes: number;
  note: string;
  /** YouTube aramasında kullanılacak sorgu */
  query: string;
  ingredients: MealIngredient[];
}

export const BASE_SERVINGS = 3;

export const MEALS: Meal[] = [
  // ——— Dana ———
  {
    id: 'dana-kontrafile-izgara',
    protein: 'dana',
    main: 'Kontrafile Izgara',
    side: 'Basmati pilavı, mevsim salatası',
    minutes: 35,
    note: 'Yanına bol maydanozlu domates salatası çok yakışır.',
    query: 'kontrafile ızgara',
    ingredients: [['danaKontrafile', 500, 'g']],
  },
  {
    id: 'dana-sote',
    protein: 'dana',
    main: 'Dana Et Sote, Biber & Domates',
    side: 'Bulgur pilavı, cacık',
    minutes: 45,
    note: 'Renkli biberler C vitamini açısından zengindir ve soteye tatlılık katar.',
    query: 'dana et sote biber domatesli',
    ingredients: [
      ['danaKusbasi', 500, 'g'],
      ['renkliBiber', 3, 'adet'],
      ['domates', 2, 'adet'],
    ],
  },
  {
    id: 'sulu-kofte',
    protein: 'dana',
    main: 'Sulu Köfte, Patatesli',
    side: 'Pilav, mevsim salatası',
    minutes: 55,
    note: 'Maydanozlu sos köfteye hafiflik katar.',
    query: 'sulu köfte patatesli',
    ingredients: [
      ['danaKiyma', 500, 'g'],
      ['patates', 3, 'adet'],
    ],
  },
  {
    id: 'bonfile-kekik-limon',
    protein: 'dana',
    main: 'Bonfile, Kekik-Limon Marineli',
    side: 'Fırın domates, roka salatası',
    minutes: 40,
    note: 'Limonlu marine etin aromasını öne çıkarır.',
    query: 'bonfile limon kekik marine',
    ingredients: [['danaBonfile', 500, 'g'], ['tazeKekik'], ['roka'], ['limon', 1, 'adet']],
  },
  {
    id: 'biber-dolmasi-dana',
    protein: 'dana',
    main: 'Biber Dolması (Dana Kıymalı)',
    side: 'Yoğurt, mevsim salatası',
    minutes: 60,
    note: 'İçine ince bulgur eklemek daha hafif bir dolma verir.',
    query: 'dana kıymalı biber dolması',
    ingredients: [['danaKiyma', 400, 'g'], ['dolmalikBiber', 6, 'adet'], ['bulgur']],
  },
  {
    id: 'sumakli-kofte-izgara',
    protein: 'dana',
    main: 'Sumak Soslu Dana Köfte Izgara',
    side: 'Bulgur tabboulesi, ayran',
    minutes: 45,
    note: 'Sumak, ızgara köfteye ekşi ve ferah bir tat katar.',
    query: 'sumak soslu köfte ızgara',
    ingredients: [['danaKiyma', 500, 'g'], ['sumak'], ['maydanoz', 1, 'demet'], ['nane']],
  },
  {
    id: 'dana-guvec',
    protein: 'dana',
    main: 'Dana Güveç, Sebzeli',
    side: 'Ekmek, yeşil salata',
    minutes: 70,
    note: 'Kabak ve domatesin taze olduğu dönemde en lezzetli hâlini alır.',
    query: 'dana eti güveç kabak domatesli',
    ingredients: [
      ['danaKusbasi', 500, 'g'],
      ['kabak', 2, 'adet'],
      ['domates', 3, 'adet'],
    ],
  },

  // ——— Tavuk ———
  {
    id: 'tavuk-sote',
    protein: 'tavuk',
    main: 'Tavuk Sote, Biberli',
    side: 'Basmati pilavı, cacık',
    minutes: 35,
    note: 'Renkli biberler C vitamini açısından zengindir.',
    query: 'biberli tavuk sote',
    ingredients: [
      ['tavukGogsu', 600, 'g'],
      ['renkliBiber', 2, 'adet'],
    ],
  },
  {
    id: 'izgara-tavuk-limon',
    protein: 'tavuk',
    main: 'Izgara Tavuk, Limon-Sarımsak',
    side: 'Makarna (zeytinyağlı), yeşil salata',
    minutes: 30,
    note: 'Izgarada yağsız pişer; hafif bir akşam yemeği.',
    query: 'limon sarımsak ızgara tavuk',
    ingredients: [
      ['tavukGogsu', 600, 'g'],
      ['limon', 2, 'adet'],
    ],
  },
  {
    id: 'firin-tavuk-but-hardal',
    protein: 'tavuk',
    main: 'Kekik-Hardal Fırın Tavuk But',
    side: 'Fırın patates, mevsim salatası',
    minutes: 55,
    note: 'Hardal ve kekik marinesi ete derin bir aroma katar.',
    query: 'hardal kekik fırın tavuk but',
    ingredients: [
      ['tavukBut', 6, 'adet'],
      ['patates', 4, 'adet'],
      ['hardal', 1, 'kavanoz'],
    ],
  },
  {
    id: 'tavuk-sis',
    protein: 'tavuk',
    main: 'Tavuk Şiş, Közlenmiş Biberli',
    side: 'Bulgur pilavı, yoğurt',
    minutes: 40,
    note: 'Közlenmiş biberin isli tadı tavukla çok iyi gider.',
    query: 'tavuk şiş közlenmiş biberli',
    ingredients: [
      ['tavukGogsu', 600, 'g'],
      ['renkliBiber', 3, 'adet'],
    ],
  },
  {
    id: 'tavuk-corbasi-zerdecal',
    protein: 'tavuk',
    main: 'Zerdeçallı Tavuk Çorbası',
    side: 'Ekmek, yeşil salata',
    minutes: 40,
    note: 'Zerdeçal çorbaya sıcak bir renk ve hafif baharatlı bir aroma verir.',
    query: 'zerdeçallı tavuk çorbası',
    ingredients: [['tavukBut', 2, 'adet'], ['zerdecal'], ['havuc', 2, 'adet'], ['sehriye']],
  },
  {
    id: 'tahinli-tavuk-but',
    protein: 'tavuk',
    main: 'Tahin-Limon Soslu Tavuk But',
    side: 'Makarna, mevsim salatası',
    minutes: 45,
    note: 'Tahin kalsiyum açısından zengindir; limonla ferah bir sos olur.',
    query: 'tahin limon soslu tavuk but',
    ingredients: [
      ['tavukBut', 6, 'adet'],
      ['tahin', 1, 'kavanoz'],
      ['limon', 1, 'adet'],
    ],
  },
  {
    id: 'biber-dolmasi-tavuk',
    protein: 'tavuk',
    main: 'Tavuk Dolması (Biberli)',
    side: 'Pilav, cacık',
    minutes: 60,
    note: 'İçindeki pirinç doyurucu; yanındaki cacık serinletici.',
    query: 'tavuk kıymalı biber dolması',
    ingredients: [
      ['tavukKiyma', 400, 'g'],
      ['dolmalikBiber', 6, 'adet'],
    ],
  },

  // ——— Balık ———
  {
    id: 'izgara-levrek',
    protein: 'balik',
    main: 'Izgara Levrek, Limon-Dereotu',
    side: 'Roka-domates salatası, ızgara kabak',
    minutes: 25,
    note: 'Dereotu ve limon, balıkla klasik bir Akdeniz eşleşmesidir.',
    query: 'ızgara levrek dereotlu',
    ingredients: [['levrek', 3, 'adet'], ['dereotu'], ['kabak', 2, 'adet'], ['roka']],
  },
  {
    id: 'firin-somon',
    protein: 'balik',
    main: 'Fırın Somon, Kapari Soslu',
    side: 'Yeşil salata, limon',
    minutes: 30,
    note: 'Somon, omega-3 açısından en zengin balıklardandır.',
    query: 'fırın somon kapari soslu',
    ingredients: [
      ['somon', 600, 'g'],
      ['kapari', 1, 'kavanoz'],
      ['limon', 2, 'adet'],
    ],
  },
  {
    id: 'kagitta-cupra',
    protein: 'balik',
    main: 'Kağıtta Çupra Fırında',
    side: 'Bol yeşil salata, maydanoz',
    minutes: 35,
    note: 'Kağıtta pişirme yağ gerektirmez ve balığın nemini korur.',
    query: 'kağıtta çupra fırında',
    ingredients: [['cupra', 3, 'adet'], ['pisirmeKagidi'], ['kirazDomates', 250, 'g']],
  },
  {
    id: 'hamsi-tava',
    protein: 'balik',
    main: 'Hamsi Tava (Mısır Unlu)',
    side: 'Roka salatası, limon',
    minutes: 20,
    note: 'Hamsi ekonomik bir omega-3 kaynağıdır; mısır unu çıtırlık verir.',
    query: 'mısır unlu hamsi tava',
    ingredients: [['hamsi', 700, 'g'], ['misirUnu']],
  },
  {
    id: 'uskumru-dolmasi',
    protein: 'balik',
    main: 'Uskumru Dolması, Zeytinyağlı',
    side: 'Mevsim salatası, limon',
    minutes: 50,
    note: 'Uskumru B12 vitamini açısından zengindir.',
    query: 'uskumru dolması zeytinyağlı',
    ingredients: [['uskumru', 3, 'adet'], ['ceviz'], ['kuruUzum']],
  },
  {
    id: 'pisi-guvec',
    protein: 'balik',
    main: 'Pisi Balığı Güveç, Domates-Sarımsak',
    side: 'Yeşil salata, ekmek',
    minutes: 40,
    note: 'Hafif, az yağlı bir balık yemeği; domates ve sarımsak sosu lezzeti tamamlar.',
    query: 'pisi balığı güveç domates sarımsaklı',
    ingredients: [
      ['pisi', 600, 'g'],
      ['domates', 3, 'adet'],
    ],
  },

  // ——— Baklagil & sebze ———
  {
    id: 'nohut-yemegi',
    protein: 'baklagil',
    main: 'Nohut Yemeği, Domatesli',
    side: 'Pilav, yoğurt',
    minutes: 35,
    note: 'Nohut ve pilav birlikte doyurucu, dengeli bir tabak oluşturur.',
    query: 'domatesli nohut yemeği',
    ingredients: [
      ['nohut', 2, 'kutu'],
      ['domates', 3, 'adet'],
    ],
  },
  {
    id: 'yesil-mercimek-corbasi',
    protein: 'baklagil',
    main: 'Yeşil Mercimek Çorbası',
    side: 'Ekmek, yeşil salata',
    minutes: 35,
    note: 'Hafif ama doyurucu; mercimek iyi bir demir kaynağıdır.',
    query: 'yeşil mercimek çorbası',
    ingredients: [['yesilMercimek', 300, 'g'], ['havuc', 2, 'adet'], ['kerevizSapi']],
  },
  {
    id: 'nohut-koftesi',
    protein: 'baklagil',
    main: 'Zerdeçallı Nohut Köftesi',
    side: 'Bulgur salatası, yoğurt',
    minutes: 40,
    note: 'Nohut bitkisel protein açısından zengindir; zerdeçal ve kimyon aromayı tamamlar.',
    query: 'zerdeçallı nohut köftesi',
    ingredients: [['nohut', 2, 'kutu'], ['zerdecal'], ['kimyon']],
  },
  {
    id: 'ayran-asi',
    protein: 'baklagil',
    main: 'Ayran Aşı Çorbası',
    side: 'Ekmek, mevsim salatası',
    minutes: 30,
    note: 'Geleneksel, serinletici bir çorba; soğuk da içilir.',
    query: 'ayran aşı çorbası',
    ingredients: [['ayran', 1, 'L'], ['pirinc', 1, 'su bardağı'], ['yumurta', 2, 'adet'], ['kuruNane']],
  },
  {
    id: 'taze-fasulye',
    protein: 'baklagil',
    main: 'Taze Fasulye, Zeytinyağlı',
    side: 'Pilav, yoğurt',
    minutes: 40,
    note: 'Zeytinyağlılar ılık ya da soğuk servis edilir; önceden hazırlanabilir.',
    query: 'zeytinyağlı taze fasulye',
    ingredients: [
      ['tazeFasulye', 500, 'g'],
      ['domates', 2, 'adet'],
    ],
  },
  {
    id: 'yogurtlu-kabak',
    protein: 'baklagil',
    main: 'Kabak Yemeği, Yoğurtlu',
    side: 'Pilav, salata',
    minutes: 30,
    note: 'Kabak su oranı yüksek, hafif bir sebzedir.',
    query: 'yoğurtlu kabak yemeği',
    ingredients: [
      ['kabak', 4, 'adet'],
      ['yogurt', 500, 'g'],
    ],
  },
];

export const MEALS_BY_ID: Record<string, Meal> = Object.fromEntries(MEALS.map((m) => [m.id, m]));

export const DAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
export const DAYS_SHORT = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

/** Bir günün kabul ettiği ana malzeme türleri; birden fazlaysa o gün için aralarından rastgele biri gelir. */
export type DayProteins = Protein[];

export const DEFAULT_PATTERN: DayProteins[] = (
  ['dana', 'tavuk', 'balik', 'baklagil', 'dana', 'balik', 'tavuk'] as Protein[]
).map((protein) => [protein]);

export function youtubeUrl(query: string): string {
  return (
    'https://www.youtube.com/results?search_query=' + encodeURIComponent(query + ' tarifi türkçe')
  );
}
