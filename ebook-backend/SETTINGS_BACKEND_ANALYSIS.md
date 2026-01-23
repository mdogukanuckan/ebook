# Settings Sayfası Backend Analizi ve Eksikler

## 🔍 Mevcut Durum Analizi

### ✅ Var Olan Endpoint'ler

#### UserController.java
```java
@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    
    ✅ POST   /api/v1/users/register     - Kullanıcı kaydı
    ✅ GET    /api/v1/users/{id}         - ID ile kullanıcı getir
    ✅ GET    /api/v1/users/search       - Username ile kullanıcı getir
    ✅ GET    /api/v1/users              - Tüm kullanıcıları getir
    ✅ DELETE /api/v1/users/{id}         - Kullanıcı sil
}
```

### ❌ Eksik Endpoint'ler (Settings Sayfası İçin Gerekli)

Settings sayfası için şu endpoint'ler **EKSİK**:

1. **PUT /api/v1/users/{id}** - Profil bilgilerini güncelle
2. **PUT /api/v1/users/{id}/password** - Şifre değiştir
3. **GET /api/v1/users/me** - Mevcut kullanıcıyı getir (JWT token'dan)

---

## 📋 Gerekli DTO'lar

### ❌ Eksik DTO'lar:

1. **UserUpdateDTO** - Profil güncelleme için
2. **PasswordChangeDTO** - Şifre değiştirme için

---

## 🎯 Settings Sayfası Özellikleri

### 1. Profil Bilgileri Güncelleme
- **Güncellenebilir Alanlar:**
  - ✅ firstName
  - ✅ lastName
  - ✅ email (benzersizlik kontrolü gerekli)
  - ❌ username (değiştirilemez - güvenlik)

### 2. Şifre Değiştirme
- **Gerekli Alanlar:**
  - Mevcut şifre (doğrulama için)
  - Yeni şifre
  - Yeni şifre tekrar

### 3. Hesap Ayarları
- Email bildirimleri (gelecekte)
- Hesap silme (zaten var: DELETE /users/{id})

---

## 🔧 Yapılması Gerekenler

### Backend Tarafı

#### 1. UserUpdateDTO Oluştur
**Dosya:** `dto/UserUpdateDTO.java`

```java
package com.ebookreader.ebook_backend.modules.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserUpdateDTO {
    
    @NotBlank(message = "İsim alanı boş olamaz")
    private String firstName;
    
    @NotBlank(message = "Soyisim alanı boş olamaz")
    private String lastName;
    
    @NotBlank(message = "E-mail boş olamaz")
    @Email(message = "Geçerli bir e-mail adresi giriniz")
    private String email;
}
```

---

#### 2. PasswordChangeDTO Oluştur
**Dosya:** `dto/PasswordChangeDTO.java`

```java
package com.ebookreader.ebook_backend.modules.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PasswordChangeDTO {
    
    @NotBlank(message = "Mevcut şifre boş olamaz")
    private String currentPassword;
    
    @NotBlank(message = "Yeni şifre boş olamaz")
    @Size(min = 6, message = "Şifre en az 6 karakter uzunluğunda olmalıdır")
    private String newPassword;
    
    @NotBlank(message = "Şifre tekrarı boş olamaz")
    private String confirmPassword;
}
```

---

#### 3. UserService Interface'ini Genişlet
**Dosya:** `service/UserService.java`

```java
public interface UserService {
    
    // Mevcut metodlar
    UserResponseDTO createUser(UserCreateDTO userCreateDto);
    UserResponseDTO getUserById(Long id);
    UserResponseDTO getUserByUserName(String username);
    List<UserResponseDTO> getAllUsers();
    void deleteUser(Long id);
    
    // ✅ YENİ METODLAR
    UserResponseDTO updateUser(Long id, UserUpdateDTO userUpdateDTO);
    void changePassword(Long id, PasswordChangeDTO passwordChangeDTO);
    UserResponseDTO getCurrentUser(String username); // JWT'den gelen username
}
```

---

#### 4. UserServiceImpl'de Metodları Implement Et
**Dosya:** `service/UserServiceImpl.java`

```java
@Override
public UserResponseDTO updateUser(Long id, UserUpdateDTO request) {
    User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı! ID:" + id));
    
    // Email değişmişse ve başka kullanıcı tarafından kullanılıyorsa hata fırlat
    if (!user.getEmail().equals(request.getEmail()) && 
        userRepository.existsByEmail(request.getEmail())) {
        throw new BusinessException("E-posta adresi sistemde mevcut.");
    }
    
    // Bilgileri güncelle
    user.setFirstName(request.getFirstName());
    user.setLastName(request.getLastName());
    user.setEmail(request.getEmail());
    
    User updatedUser = userRepository.save(user);
    return userMapper.toResponse(updatedUser);
}

@Override
public void changePassword(Long id, PasswordChangeDTO request) {
    User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı! ID:" + id));
    
    // Yeni şifre ve tekrarı eşleşiyor mu?
    if (!request.getNewPassword().equals(request.getConfirmPassword())) {
        throw new BusinessException("Yeni şifreler eşleşmiyor.");
    }
    
    // Mevcut şifre doğru mu? (PasswordEncoder kullanarak)
    if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
        throw new BusinessException("Mevcut şifre yanlış.");
    }
    
    // Yeni şifreyi hashle ve kaydet
    user.setPassword(passwordEncoder.encode(request.getNewPassword()));
    userRepository.save(user);
}

@Override
@Transactional(readOnly = true)
public UserResponseDTO getCurrentUser(String username) {
    User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı: " + username));
    return userMapper.toResponse(user);
}
```

**Not:** `PasswordEncoder` dependency injection gerekli:
```java
private final PasswordEncoder passwordEncoder;
```

---

#### 5. UserController'a Endpoint'leri Ekle
**Dosya:** `controller/UserController.java`

```java
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    // Mevcut endpoint'ler...
    
    // ✅ YENİ ENDPOINT'LER
    
    /**
     * Mevcut kullanıcıyı getir (JWT token'dan)
     */
    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> getCurrentUser(Principal principal) {
        String username = principal.getName();
        return ResponseEntity.ok(userService.getCurrentUser(username));
    }
    
    /**
     * Kullanıcı bilgilerini güncelle
     */
    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDTO> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserUpdateDTO request,
            Principal principal) {
        
        // Sadece kendi profilini güncelleyebilir (veya admin)
        // Bu kontrol için ayrı bir güvenlik katmanı eklenebilir
        
        UserResponseDTO response = userService.updateUser(id, request);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Şifre değiştir
     */
    @PutMapping("/{id}/password")
    public ResponseEntity<Void> changePassword(
            @PathVariable Long id,
            @Valid @RequestBody PasswordChangeDTO request,
            Principal principal) {
        
        // Sadece kendi şifresini değiştirebilir
        
        userService.changePassword(id, request);
        return ResponseEntity.ok().build();
    }
}
```

---

## 🔐 Güvenlik Kontrolleri

### Önemli: Kullanıcı Sadece Kendi Bilgilerini Değiştirebilmeli

**Seçenek 1: Controller'da Kontrol**
```java
@PutMapping("/{id}")
public ResponseEntity<UserResponseDTO> updateUser(
        @PathVariable Long id,
        @Valid @RequestBody UserUpdateDTO request,
        Principal principal) {
    
    // Mevcut kullanıcıyı al
    UserResponseDTO currentUser = userService.getCurrentUser(principal.getName());
    
    // Sadece kendi profilini güncelleyebilir
    if (!currentUser.getId().equals(id)) {
        throw new BusinessException("Sadece kendi profilinizi güncelleyebilirsiniz.");
    }
    
    UserResponseDTO response = userService.updateUser(id, request);
    return ResponseEntity.ok(response);
}
```

**Seçenek 2: @PreAuthorize ile (Önerilen)**
```java
@PutMapping("/{id}")
@PreAuthorize("#id == authentication.principal.id or hasRole('ADMIN')")
public ResponseEntity<UserResponseDTO> updateUser(
        @PathVariable Long id,
        @Valid @RequestBody UserUpdateDTO request) {
    
    UserResponseDTO response = userService.updateUser(id, request);
    return ResponseEntity.ok(response);
}
```

---

## 📊 Özet: Eklenmesi Gereken Dosyalar

### Yeni Dosyalar:
1. ✅ `dto/UserUpdateDTO.java`
2. ✅ `dto/PasswordChangeDTO.java`

### Güncellenecek Dosyalar:
1. ✅ `service/UserService.java` - 3 metod ekle
2. ✅ `service/UserServiceImpl.java` - 3 metod implement et
3. ✅ `controller/UserController.java` - 3 endpoint ekle

---

## 🧪 Test Endpoint'leri

### 1. Mevcut Kullanıcıyı Getir
```http
GET /api/v1/users/me
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": 1,
  "username": "mduckan",
  "email": "dogukanuckan@gmail.com",
  "firstName": "Mehmet Doğukan",
  "lastName": "Uçkan",
  "roles": ["ROLE_ADMIN"]
}
```

---

### 2. Profil Güncelle
```http
PUT /api/v1/users/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "firstName": "Mehmet",
  "lastName": "Uçkan",
  "email": "yeni@email.com"
}
```

**Response:**
```json
{
  "id": 1,
  "username": "mduckan",
  "email": "yeni@email.com",
  "firstName": "Mehmet",
  "lastName": "Uçkan",
  "roles": ["ROLE_ADMIN"]
}
```

---

### 3. Şifre Değiştir
```http
PUT /api/v1/users/1/password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "sifre123456",
  "newPassword": "yeniSifre123",
  "confirmPassword": "yeniSifre123"
}
```

**Response:**
```http
200 OK
```

---

## ✅ Kontrol Listesi

### Backend:
- [ ] `UserUpdateDTO.java` oluşturuldu
- [ ] `PasswordChangeDTO.java` oluşturuldu
- [ ] `UserService.java` interface'ine 3 metod eklendi
- [ ] `UserServiceImpl.java`'de 3 metod implement edildi
- [ ] `UserController.java`'ya 3 endpoint eklendi
- [ ] PasswordEncoder dependency eklendi
- [ ] Güvenlik kontrolleri eklendi
- [ ] Backend test edildi

---

Bu döküman, Settings sayfası için backend'de yapılması gereken tüm değişiklikleri detaylı olarak açıklamaktadır.
