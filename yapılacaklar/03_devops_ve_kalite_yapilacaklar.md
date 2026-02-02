# ⚙️ DevOps ve Kalite Yapılacaklar Listesi

Projenin canlıya alınması ve sağlıklı bir şekilde yayın hayatına devam etmesi için gerekli teknik altyapı çalışmaları.

### 1. Dağıtım ve Yayın (Öncelik: Yüksek)
- [ ] **Docker:** 
  - Backend için `Dockerfile` yazımı.
  - Frontend için `Dockerfile` (Nginx tabanlı) yazımı.
  - Veritabanı, Redis ve uygulamaları kapsayan `docker-compose.yml` oluşturulması.
- [ ] **Environment Variables:** Development ve Production ortamları için `.env` ve `application.properties` dosyalarının ayrıştırılması.

### 2. Sürekli Entegrasyon (CI/CD) (Öncelik: Orta)
- [ ] **GitHub Actions:**
  - Kod pushlandığında testleri koşturan bir workflow.
  - Merge yapıldığında Docker image'larını build edip Docker Hub'a (veya başka bir registry'e) atan workflow.

### 3. İzleme ve Bakım (Öncelik: Orta)
- [ ] **Hata İzleme:** Frontend ve Backend için `Sentry` entegrasyonu (Canlıdaki hataları anlık takip edebilmek için).
- [ ] **Health Check:** Spring Boot Actuator kullanılarak uygulamanın sağlık durumunun izlenmesi.
- [ ] **Yedekleme:** Veritabanının düzenli yedeklenmesi için bir script/servis kurulması.

### 4. Dokümantasyon (Öncelik: Düşük)
- [ ] **README.md Güncelleme:** Projenin lokalde nasıl kurulacağı, ortam değişkenlerinin neler olduğu ve API dokümantasyon bilgileri.
- [ ] **Kullanıcı Kılavuzu:** Adminler için sistemin nasıl yönetileceğine dair kısa bir doküman.
- [ ] **Kod Standartları:** Prettier/ESLint (frontend) ve Checkstyle (backend) kurallarının tanımlanması.
