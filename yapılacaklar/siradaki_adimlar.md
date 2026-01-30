# Proje Durumu ve Yapılacaklar Listesi

Mevcut proje yapısı (`ebook-frontend` ve `yapılacaklar` klasörleri) incelendiğinde, daha önceki planlamaların büyük bir kısmının hayata geçirildiği (`features` yapısına geçiş gibi) ancak bazı temizlik ve tamamlanması gereken kritik adımların olduğu görülmektedir.

## 1. Temizlik ve Düzenleme (Refactoring)
- [x] **Gereksiz Klasörün Silinmesi (`ReadinProgress`):** `src/features/ReadinProgress` klasörü muhtemelen isim hatasıyla oluşturulmuş. Projede aktif olarak `src/features/reading` kullanılıyor. `ReadinProgress` klasörü içerisindeki dosyalar kontrol edilip gereksizse silinmeli.
- [x] **Hardcoded URL'lerin Kaldırılması:** `BookDetailPage.tsx` dosyasında `window.open` içerisine `http://localhost:8080...` şeklinde statik URL yazılmış. Bu durum canlı ortamda (deploy edildiğinde) hataya yol açar. Bu URL `.env` üzerinden veya conf dosyasından (örn: `API_BASE_URL`) alınacak şekilde dinamik hale getirilmeli.
- [x] **User Feature Modülü:** `features` dizininde `auth`, `books`, `reading` ve `subscription` mevcut ancak `user` modülü eksik. Kullanıcı profili, ayarlar ve şifre işlemleri için `features/user` yapısının kurulması mimari bütünlük için önerilir.

## 2. Eksik Özelliklerin Kontrolü
- [x] **Subscription Modülü Entegrasyonu:** `features/subscription` klasörü ve `SubscriptionPage.tsx` incelendi. Servisler (`getPlans`, `subscribeToPlan` vb.) ve UI bileşenleri (`PlanCard`, `SubscriptionStatus`) mevcut ve entegre edilmiş durumda.
- [x] **Admin Yönetimi ve Güvenlik (RBAC):**
    - [x] `PrivateRoute` bileşeni şu an sadece oturum kontrolü yapıyor. Rol tabanlı (Role-Based Access Control) koruma eklenmeli. `roles` prop'u alarak sadece yetkili kullanıcıların (örn: ROLE_ADMIN) girebileceği sayfalar oluşturulmalı.
    - [x] Admin Dashboard sayfası oluşturulmalı.
    - [x] Kitap Ekleme/Düzenleme sayfaları (`/books/new` vb.) Admin rolü ile korunmalı.
    - [x] Navbar'da sadece Admin kullanıcılara görünecek bir "Yönetim Paneli" linki eklenmeli.

## 3. Arayüz ve UX İyileştirmeleri
- [x] **Görsel İyileştirmeler:** Kullanıcı deneyimini artırmak için "Loading" durumlarında basit metinler yerine `LoadingScreen` bileşeni kullanıldı (`BookDetailPage.tsx` örneği).
- [x] **Hata Yönetimi:** API hatalarında kullanıcıya gösterilen mesajlar için generic Toast mekanizması devreye alındı (`BookDetailPage.tsx` örneği). `addToast` action'ı kullanılarak hatalar gösteriliyor.

## 4. Kritik Kontrol (Auth Persistence)
- [x] **Oturum Sürekliliği:** `App.tsx` içerisinde yapılan düzenleme ile, sayfa yenilendiğinde kullanıcı bilgileri yüklenene kadar Router'ın render edilmesi engellendi. Bu sayede `PrivateRoute`'un "kullanıcı yok" diyerek oturumu kapatması veya yanlış yönlendirme yapması (Race Condition) önlendi.


**Özet:** Öncelik `ReadinProgress` klasör karmaşasını çözmek ve `BookDetailPage` içindeki statik URL'i düzeltmek olmalı. Ardından `Subscription` ve `User` modülleri üzerinde çalışılmalıdır.
