# Frontend Yapılandırma ve Eksiklik Raporu

Backend ve Frontend tarafında yapılan incelemeler sonucunda, Backend tarafında yer alan `Book`, `Subscription` ve `ReadingProgress` modüllerinin Frontend tarafında tam karşılığının olmadığı veya içinin boş olduğu tespit edilmiştir. Frontend mimarisinin korunarak `features` tabanlı yapının tamamlanması gerekmektedir.

## 1. Tespit Edilen Eksiklikler

| Modül | Durum | Eksik Parçalar |
|-------|-------|----------------|
| **Book & Category & Author** | **Kritik** | `src/features/books` klasörü boş. `types/book.ts` ve `services/bookService.ts` dosyaları boş. |
| **Subscription** | **Kritik** | `src/features/subscription` klasörü boş. Service ve Type tanımları eksik. |
| **Reading Progress** | **Eksik** | Frontend'de bu modül için oluşturulmuş bir yapı (feature, service, type) hiç bulunmuyor. |
| **User** | **Kısmi** | Global `userService.ts` var ancak `features/user` yapısı kurulmamış. Type tanımları dağınık (Auth içinde). |

## 2. Önerilen Klasör Yapılanması

Projenin mevcut yapısına (`features` based architecture) uygun olarak aşağıdaki klasör ve dosya yapısının oluşturulması önerilir.

### 2.1 Books Modülü (`src/features/books`)

Backend'deki `BookController`, `CategoryController` ve `AuthorController` bu modülde toplanmalıdır.

```
src/features/books/
├── assets/                 # Kitap kapak görselleri vs.
├── components/             # Kitap listeleme, detay vb. bileşenler
│   ├── BookList.tsx
│   ├── BookCard.tsx
│   ├── BookDetail.tsx
│   └── CategoryFilter.tsx
├── hooks/                  # Data fetching hook'ları (React Query vb. kullanılırsa)
│   ├── useBooks.ts
│   └── useCategories.ts
├── services/               # API İstekleri
│   ├── bookService.ts      # getBooks, getBookById, createBook...
│   ├── categoryService.ts  # getCategories...
│   └── authorService.ts    # getAuthors...
└── types/                  # TypeScript Interface'leri
    └── index.ts            # Book, Category, Author tipleri
```

### 2.2 Subscription Modülü (`src/features/subscription`)

Backend'deki `SubscriptionController` için:

```
src/features/subscription/
├── components/
│   ├── PlanCard.tsx
│   └── SubscriptionStatus.tsx
├── services/
│   └── subscriptionService.ts # upgradePlan, cancelSubscription...
└── types/
    └── index.ts
```

### 2.3 Reading Progress Modülü (`src/features/reading`)

Backend'deki `ReadingProgressController` için yeni bir feature oluşturulmalı:

```
src/features/reading/
├── components/
│   └── ProgressBar.tsx
├── services/
│   └── progressService.ts     # updateProgress, getProgress...
└── types/
    └── index.ts
```

## 3. Yapılacaklar Listesi (Adım Adım)

### Adım 1: Tip Tanımlamaları (Types)
Backend DTO'larına (`*Dto.java`) karşılık gelen interface'leri oluşturun.

**`src/features/books/types/index.ts` Örneği:**
```typescript
export interface Author {
    id: number;
    name: string;
    biography: string;
}

export interface Category {
    id: number;
    name: string;
    description: string;
}

export interface Book {
    id: number;
    title: string;
    description: string;
    price: number;
    coverImage?: string;
    author: Author;
    categories: Category[];
    createdAt: string;
}

// Backend CreateDTO'larına karşılık gelen tipler
export interface CreateBookRequest {
    title: string;
    description: string;
    price: number;
    authorId: number;
    categoryIds: number[];
}
```

### Adım 2: Servislerin Yazılması (Services)
Axios instance'ını kullanarak servis fonksiyonlarını yazın. `src/lib/axios` kullanıldığından emin olun.

**`src/features/books/services/bookService.ts` Örneği:**
```typescript
import axiosInstance from '@/lib/axios'; // Import yolunu projenize göre düzenleyin
import { Book, CreateBookRequest } from '../types';

export const getBooks = async (): Promise<Book[]> => {
    const response = await axiosInstance.get('/books');
    return response.data;
};

export const getBookById = async (id: number): Promise<Book> => {
    const response = await axiosInstance.get(`/books/${id}`);
    return response.data;
};

export const createBook = async (data: CreateBookRequest): Promise<Book> => {
    const response = await axiosInstance.post('/books', data);
    return response.data;
};
```

### Adım 3: User Modülünün Taşınması
Mevcut `src/services/userService.ts` dosyasını `src/features/user/services/userService.ts` konumuna taşıyarak yapıyı standardize edebilirsiniz. `User` tipi için de `src/features/user/types/index.ts` oluşturulmalıdır.

## 4. Özet
Mevcut frontend yapısında `shared` (global) klasörler ile `features` klasörleri arasında bir karışıklık var. Önerilen, iş mantığını mümkün olduğunca `features` altına taşımak ve `src/services` altında sadece global (örneğin `storageService`, `api` yapılandırması) dosyaları bırakmaktır.
