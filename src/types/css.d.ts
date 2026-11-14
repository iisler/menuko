// CSS dosyalarının içe aktarılabilmesi için tip tanımı (ör. '@/global.css').
// expo-env.d.ts git'e girmediğinden, temiz bir ortamda (CI) tip kontrolü bu dosya olmadan başarısız olur.
declare module '*.css';
