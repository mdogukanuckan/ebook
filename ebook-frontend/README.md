# E-Book Reader Frontend

Kurumsal standartlarda geliştirilmiş, React ve modern web teknolojileri kullanan E-Book okuma platformu ön yüzü.

## 🚀 Teknolojiler

- **Core:** React 19, TypeScript
- **Build & Dev:** Vite
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM v7
- **Forms:** React Hook Form + Zod
- **Testing:** Vitest + React Testing Library
- **Icons:** Lucide React

## 📂 Proje Yapısı

Proje, özellik tabanlı (feature-based) modüler bir mimari kullanır:

```
src/
├── api/             # Merkezi API exportları
├── components/      # UI Bileşen Kütüphanesi (Button, Card, Modal, Toast...)
├── features/        # İş mantığı modülleri (Auth, Books, Subscription)
│   ├── auth/
│   ├── books/
│   └── subscription/
├── layouts/         # Sayfa düzenleri
├── pages/           # Sayfa bileşenleri
├── routes/          # Routing konfigürasyonu
├── store/           # Redux store ve slice'lar
├── types/           # TypeScript tip tanımları
└── lib/             # 3. parti kütüphane konfigürasyonları (axios vb.)
```

## 🛠️ Kurulum ve Çalıştırma

Gerekli paketleri yükleyin:

```bash
npm install
```

Geliştirme sunucusunu başlatın:

```bash
npm run dev
```

## 🧪 Testler

Unit ve integration testlerini çalıştırın:

```bash
npm run test
```

## 🔐 Güvenlik ve Özellikler

- **JWT Authentication:** Access token ve Refresh token mekanizması.
- **Secure Storage:** Hassas kullanıcı verileri LocalStorage'da saklanmaz.
- **Error Handling:** Global Error Boundary ve Toast bildirim sistemi.
- **Lazy Loading:** Sayfalar code-splitting ile yüklenir.
