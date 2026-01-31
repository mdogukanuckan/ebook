# Sırada Yapılması Gerekenler

Projenin mevcut durumu incelendiğinde; **Admin Paneli**, **Ana Sayfa** ve **Güvenlik (RBAC)** altyapısının başarıyla kurulduğu görülmektedir. Ancak uygulamanın tam fonksiyonel bir "Admin Yönetim Sistemi" ve "E-Kitap Okuma Platformu" olabilmesi için aşağıdaki adımların tamamlanması gerekmektedir.

## 1. Admin Paneli Geliştirmeleri (Öncelikli)
Şu an Admin Dashboard sadece "Yeni Ekleme" linkleri vermektedir. Mevcut verilerin yönetimi eksiktir.
- [x] **Kullanıcı Yönetimi (User Management):**
    - `AdminDashboard` sayfasındaki "Yakında" butonu aktifleştirilmeli.
    - Tüm kullanıcıların listelendiği, rollerinin (USER/ADMIN) değiştirilebildiği ve gerekirse hesabın pasife alınabildiği bir tablo arayüzü yapılmalı.
- [x] **Kitap Düzenleme ve Silme:**
    - Kitap detay sayfasında (`BookDetailPage`), eğer giren kişi `ADMIN` ise "Düzenle" ve "Sil" butonları görünmeli.
    - Alternatif olarak Admin panelinde tüm kitapların liste halinde görüldüğü ve üzerinde işlem yapılabildiği bir "Kitap Listesi" sayfası oluşturulmalı.

## 2. Eksik Sayfa ve Özellikler
- [x] **Okuma Deneyimi (Reading Experience):**
    - `BookDetailPage` içerisindeki "Start Reading" butonu şu an backend URL'ine yönlendiriyor. Eğer backend sadece PDF binary verisi dönüyorsa, frontend tarafında basit bir **PDF Viewer** (örn: `react-pdf` veya iframe) entegrasyonu yapılmalı ki kullanıcı uygulamadan çıkmadan kitap okuyabilsin.
- [x] **Abonelik Yönetimi:**
    - Admin panelindeki "Abonelik Planları" kısmı backend ile bağlanmalı. Yeni plan oluşturma veya mevcut planların fiyatını güncelleme ekranları eklenmeli.
    - `Plan` entity'si ve ilgili CRUD endpoint'leri oluşturuldu. Admin panelinde `PlanManagementPage` eklendi.

## 3. Görsel Tasarım Bütünlüğü
- [x] **Diğer Sayfaların Modernizasyonu:**
    - `HomePage` ve `Navbar` için yapılan modern tasarım (Glassmorphism, Gradientler), `SearchPage`, `ProfilePage` ve `LoginPage`/`RegisterPage` sayfalarına da uygulanmalı.
    - Özellikle form ekranlarının (Giriş/Kayıt) daha estetik hale getirilmesi kullanıcı deneyimini artıracaktır.

## 4. Test ve Optimizasyon
- [x] **Mobil Uyumluluk Kontrolü:** Yeni eklenen grid yapılarının ve navbar'ın mobil cihazlarda (telefonda) düzgün göründüğünden emin olunmalı. (Navbar mobil menüsü eklendi, grid yapıları kontrol edildi.)
- [x] **Search İyileştirmesi:** Arama sayfasında anlık filtreleme (Debounce) var ancak kategori ve sıralama filtrelerinin backend ile tam uyumlu çalıştığı test edilmeli. (Sıralama özelliği eklendi ve backend entegrasyonu sağlandı.)

---
**Öneri:** İlk olarak **Admin panelindeki Kullanıcı Yönetimi** modülüne odaklanarak sistemin yönetim kabiliyetini artırmanız tavsiye edilir. Ardından PDF görüntüleme işine bakılabilir.
