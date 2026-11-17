const MONTHS = [
  'Ocak',
  'Şubat',
  'Mart',
  'Nisan',
  'Mayıs',
  'Haziran',
  'Temmuz',
  'Ağustos',
  'Eylül',
  'Ekim',
  'Kasım',
  'Aralık',
];

/** Pazartesi = 0 … Pazar = 6 */
export function todayIndex(now: Date = new Date()): number {
  return (now.getDay() + 6) % 7;
}

/** İçinde bulunulan haftanın aralığı: "9–15 Kasım" ya da "30 Kasım – 6 Aralık" */
export function weekRangeLabel(now: Date = new Date()): string {
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - todayIndex(now));
  const sunday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6);
  const end = `${sunday.getDate()} ${MONTHS[sunday.getMonth()]}`;
  return monday.getMonth() === sunday.getMonth()
    ? `${monday.getDate()}–${end}`
    : `${monday.getDate()} ${MONTHS[monday.getMonth()]} – ${end}`;
}

const WEEKDAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

/** "Salı, 17 Kasım" */
export function todayLabel(now: Date = new Date()): string {
  return `${WEEKDAYS[todayIndex(now)]}, ${now.getDate()} ${MONTHS[now.getMonth()]}`;
}
