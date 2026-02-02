# 🛠 Backend Yapılacaklar Listesi

Backend tarafında güvenliği, ölçeklenebilirliği ve sürdürülebilirliği artırmak için aşağıdaki adımlar izlenmelidir.

### 1. API Dökümantasyonu (Öncelik: Yüksek)
- [ ] `springdoc-openapi-starter-webmvc-ui` bağımlılığının eklenmesi.
- [ ] Tüm Controller metotlarının `@Operation` ve `@ApiResponse` ile tanımlanması.
- [ ] Swagger UI arayüzünün erişime açılması (`/swagger-ui.html`).

### 2. Test Kapsamı (Öncelik: Yüksek)
- [ ] **Unit Testler:** `Service` katmanındaki tüm iş mantığının JUnit 5 ve Mockito ile test edilmesi.
- [ ] **Integration Testler:** Controller endpoint'lerinin `MockMvc` ve `@SpringBootTest` ile gerçek veritabanı (H2 veya TestContainers) üzerinde test edilmesi.
- [ ] **Validation Testleri:** DTO validasyon kurallarının test edilmesi.

### 3. Güvenlik İyileştirmeleri (Öncelik: Orta)
- [ ] **Refresh Token:** Mevcut JWT yapısına refresh token desteği eklenerek kullanıcı deneyiminin iyileştirilmesi.
- [ ] **Rate Limiting:** API'yi kötü niyetli isteklere karşı korumak için `Bucket4j` veya benzeri bir kütüphane ile limit eklenmesi.
- [ ] **CORS Yapılandırması:** Sadece izin verilen domainlerin erişebilmesi için ayarların sıkılaştırılması.

### 4. Hata Yönetimi (Öncelik: Orta)
- [ ] `GlobalExceptionHandler` içine `MethodArgumentNotValidException` eklenerek form hatalarının detaylı (alan bazlı) dönmesi.
- [ ] Özel iş hataları (`InadequateCreditsException`, `SubscriptionExpiredException` vb.) için yeni sınıfların oluşturulması.

### 5. Performans ve Optimizasyon (Öncelik: Düşük)
- [ ] **Redis Cache:** Kategoriler, abonelik planları ve yazar listeleri gibi nadir değişen verilerin cache'lenmesi.
- [ ] **Gelişmiş Filtreleme:** Kitap araması için `Specification` yapısı kullanılarak dinamik filtreler oluşturulması.
- [ ] **Log Yönetimi:** Logların seviyelere (INFO, WARN, ERROR) ayrılması ve dosyaya rotasyonlu yazılması.

### 6. Yeni Özellikler (Extra)
- [ ] Kullanıcı yorumları ve puanlama sistemi için yeni bir modul (`ReviewModule`).
- [ ] Bildirim sistemi (E-posta ile şifre sıfırlama, yeni kitap eklendiğinde haber verme).
