# Frontend Yol Haritası (Roadmap) ve Eksikler

Bu belge, proje yapısının incelenmesi sonucunda tespit edilen eksiklikleri ve yapılması gerekenleri öncelik sırasına göre listeler.

## 🔴 Acil ve Kritik (Yüksek Öncelik)

Bu maddeler projenin çalışabilirliği, güvenliği ve sürdürülebilirliği için elzemdir.

### 1. State Management (Redux Toolkit) Kurulumu
- **Durum:** `package.json` içerisinde `@reduxjs/toolkit` bulunuyor ancak `src/store/store.ts` dosyası **boş**. Projede global bir state yönetimi şu an aktif değil.
- **Yapılacaklar:**
  - [ ] `src/store/store.ts` içerisine Redux store konfigürasyonu yapılmalı.
  - [ ] `src/store/slices` altına auth, ui vb. slice'lar oluşturulmalı.
  - [ ] `main.tsx` veya `App.tsx` içerisinde uygulama `<Provider store={store}>` ile sarmalanmalı.

### 2. Test Altyapısının Kurulması
- **Durum:** `src/tests` klasörü var ancak içi boş (özellikle `unit`). Hiçbir test bulunmuyor.
- **Yapılacaklar:**
  - [ ] Vitest ve React Testing Library konfigürasyonunun çalıştığı doğrulanmalı.
  - [ ] Kritik `utils` fonksiyonları (validator, formatter) için unit testler yazılmalı.
  - [ ] Temel bileşenler (Button, Input) için render testleri eklenmeli.

### 3. Güvenlik İyileştirmeleri (Token Storage)
- **Durum:** `src/lib/axios.ts` içerisinde token `localStorage`'dan okunuyor.
- **Risk:** Bu yöntem XSS (Cross-Site Scripting) saldırılarına karşı savunmasızdır.
- **Yapılacaklar:**
  - [ ] Mümkünse Backend ile görüşülüp `httpOnly` cookie yapısına geçilmeli.
  - [ ] Eğer cookie mümkün değilse, token memory'de tutulup refresh token mekanizması (sessiz yenileme) kurulmalı.

---

## 🟡 Orta Öncelik (Geliştirme Süreci ve UX)

Projenin kalitesini artıracak ve geliştirmeyi hızlandıracak adımlar.

### 4. Hata Yönetimi (Error Handling)
- **Durum:** `axiosInstance` içinde console log'lar var ancak kullanıcıya gösterilen global bir hata yönetimi (Error Boundary) görünmüyor.
- **Yapılacaklar:**
  - [ ] Global bir `ErrorBoundary` bileşeni oluşturulup tüm uygulama sarmalanmalı.
  - [ ] API hataları için kullanıcı dostu Toast bildirimleri standardize edilmeli (mevcut Toast bileşeni kontrol edilip entegre edilmeli).

### 5. UI Bileşen Kütüphanesi ve Design System
- **Durum:** `src/components/common` altında temel bileşenler var ancak bir UI kütüphanesi (Shadcn/UI, MUI vb.) tam entegre edilmemiş gibi görünüyor.
- **Yapılacaklar:**
  - [ ] Projeye tutarlı bir tasarım dili (renk paleti, tipografi) kazandırılmalı. `index.css` içindeki Tailwind konfigürasyonu genişletilmeli.
  - [ ] Form elemanları, modallar ve kartlar için reusable (tekrar kullanılabilir) bileşen seti tamamlanmalı.

### 6. Feature Bazlı Eksiklikler
- **Durum:** `src/features` altında klasörler var (`auth`, `books` vb.) ancak içleri tam dolu olmayabilir.
- **Yapılacaklar:**
  - [ ] Her feature klasörünün (örneğin `features/books`) kendi `services`, `hooks` ve `components` yapılarını barındırdığından emin olunmalı.
  - [ ] API çağrılarının (`src/api`) feature klasörleri altındaki `services` dosyalarına taşınması değerlendirilmeli (modülerlik için).

---

## 🟢 Düşük Öncelik (Optimizasyon ve Ekstralar)

Zamanla eklenebilecek, "olsa güzel olur" özellikleri.

### 7. Dokümantasyon
- **Durum:** `README.md` mevcut ancak geliştirici kurulum detayları eksik olabilir.
- **Yapılacaklar:**
  - [ ] Projeyi ayağa kaldırma, build alma ve test çalıştırma adımları detaylandırılmalı.
  - [ ] Klasör yapısının mantığı yeni gelen geliştiriciler için açıklanmalı.

### 8. Performans İyileştirmeleri
- **Durum:** Lazy loading (`Suspense`) kullanılmış, bu iyi bir başlangıç.
- **Yapılacaklar:**
  - [ ] Büyük listeler için sanallaştırma (virtualization) eklenebilir.
  - [ ] Gereksiz render'ları önlemek için `React.memo` ve `useCallback` kullanımı gözden geçirilmeli.

### 9. i18n (Çoklu Dil Desteği)
- **Yapılacaklar:**
  - [ ] Uygulama genelinde metinlerin hardcoded olması yerine `react-i18next` gibi bir kütüphane ile yönetilmesi.
