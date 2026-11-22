# Menuko

Haftalık yemek planı ve alışveriş listesi uygulaması. Tarayıcıda, iPhone'da ve Android'de çalışacak şekilde tek kod tabanından yazıldı.

<p>
  <img src="docs/screenshots/plan.png" width="240" alt="Plan ekranı" />
  <img src="docs/screenshots/alisveris.png" width="240" alt="Alışveriş ekranı" />
  <img src="docs/screenshots/ayarlar-koyu.png" width="240" alt="Ayarlar ekranı, koyu tema" />
</p>

## Özellikler

- **Bugün:** Açılış ekranı "Bugün ne pişirsem?". Plandaki bugünün yemeği en üstte; altında süreye (≤ 30 / ≤ 45 dk) ve türe göre "Şimdi ne pişireyim?" önerisi. Beğendiğin öneriyi tek dokunuşla bugünün planına koyabilirsin.
- **Plan:** 7 günlük menü; günleri kilitleme, tek günü değiştirme, kilitsiz günleri karıştırma, YouTube'da tarif arama.
- **Kalori:** Her yemeğin yanında kişi başı tahmini kalori (ana yemek + yanındakiler). Nasıl hesaplandığı aşağıda.
- **Alışveriş:** Plandan otomatik çıkan, kategorili liste. Aynı malzemeler tek satırda toplanır, miktarlar kişi sayısına göre hesaplanır, liste paylaşılabilir.
- **Ayarlar:** Kişi sayısı, günlere göre ana malzeme düzeni (bir günde birden fazla tür seçilebilir; o gün için aralarından rastgele biri gelir), istenmeyen malzemeler.
- Plan, kilitler, işaretler ve tercihler cihazda saklanır. Açık ve koyu tema desteklenir.

## Yayın (GitHub Pages)

`main` dalına her değişiklik geldiğinde `.github/workflows/pages.yml` uygulamayı kendiliğinden derleyip yayınlar:

**https://iisler.github.io/menuko/**

Tek seferlik ayar: repo → Settings → Pages → *Build and deployment* → Source: **GitHub Actions**.

### Masaüstüne / ana ekrana kaydetme

- **Chrome / Edge (Mac, Windows):** adres çubuğundaki "Yükle" simgesi ya da menü → *Uygulamayı yükle*.
- **Safari (Mac):** Dosya → *Dock'a Ekle*.
- **iPhone:** Safari → Paylaş → *Ana Ekrana Ekle*.
- **Android:** Chrome menüsü → *Ana ekrana ekle*.

## Geliştirme

Bilgisayarda çalıştırmak için Node.js gerekir (yalnızca geliştirme için; yayın otomatik yapılır).

```bash
npm install
```

```bash
npx expo start
```

Menüde `w` tarayıcıyı, `i` iOS simülatörünü, `a` Android emülatörünü açar.

```bash
npm test
```

```bash
npm run typecheck
```

```bash
npm run lint
```

## Yapı

| Yol | İçerik |
| --- | --- |
| `src/app/` | Ekranlar: `index` Bugün, `plan` Haftalık plan, `shopping` Alışveriş, `settings` Ayarlar |
| `src/components/` | Ortak arayüz bileşenleri |
| `src/data/meals.ts` | Yemekler ve malzeme kataloğu |
| `src/data/nutrition.ts` | Malzeme kalori tablosu ve kalori hesabı |
| `src/lib/` | Plan oluşturma, öneri, alışveriş listesi ve tarih mantığı (testleriyle) |
| `src/store/app-store.ts` | Uygulama durumu ve cihazda saklama |
| `public/` | Web uygulaması bilgisi (manifest) ve ikonlar |
| `legacy/index.html` | İlk HTML prototipi (referans için) |

Havuzda 90 yemek var (dana 22, tavuk 22, balık 16, baklagil ve sebze 30). Yeni yemek eklemek için `src/data/meals.ts` içindeki `MEALS` listesine kayıt eklemek yeterlidir; miktarlar 3 kişi içindir. Mutfakta hep bulunan temel malzemeler (soğan, sarımsak, yağ, salça, baharat) listeye yazılmaz.

## Kalori hesabı

Kalori `src/data/nutrition.ts` içinde, internet bağlantısı gerekmeden hesaplanır. Kişi başı değer üç parçanın toplamıdır:

1. **Malzemeler:** her malzemenin gramı × 100 g'daki kalorisi. Değerler USDA FoodData Central ve TürKomp'taki çiğ / kuru ağırlık değerlerine dayanır. `adet`, `demet`, `kutu` gibi birimler gram karşılığına çevrilir (ör. 1 adet levrek ≈ 200 g fileto); bütün balıkta yalnızca yenilebilir kısım sayılır.
2. **Mutfak temelleri:** listede olmayan yağ, soğan ve salça. Yağ pişirme yöntemine göre tahmin edilir: ızgara, buğulama, çorba 2; kızartma 5; zeytinyağlı 6; diğerleri 3 yemek kaşığı.
3. **Yanındakiler:** `side` alanındaki pilav, ekmek, salata, yoğurt gibi eşlikçilerin porsiyon kalorisi. Malzeme listesinde zaten olan eşlikçi ikinci kez sayılmaz.

(1) ve (2) 3 kişilik tarifin toplamıdır, 3'e bölünür. Sonuç 10'a yuvarlanır ve `~` ile gösterilir; tarif ve porsiyon farkı ±%15-20 sapma yaratabilir. Hesap malzeme listesindeki miktarlara dayandığı için paket boyu yazılan malzemeler (ör. 500 g makarna) sonucu yükseltir.

Yeni bir malzeme eklenirse `NUTRITION` tablosuna da girilmesi gerekir; eksikse TypeScript hata verir. Yeni bir eşlikçi adı tanınmazsa `src/data/__tests__/nutrition.test.ts` testi uyarır.
