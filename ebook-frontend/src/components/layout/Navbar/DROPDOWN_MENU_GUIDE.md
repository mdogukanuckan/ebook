# Navbar'a Dropdown Kullanıcı Menüsü Ekleme Kılavuzu

## 🎯 Hedef

Mevcut Navbar'daki kullanıcı adı ve çıkış butonunu, **tıklanabilir bir dropdown menü** haline getirmek.

---

## 📋 Mevcut Durum

**Şu anki yapı:**
```tsx
<div className={styles.userSection}>
    <div className={styles.userInfo}>
        <User size={18} />
        <span>{user?.username}</span>
    </div>
    <button onClick={handleLogout} className={styles.logoutButton}>
        <LogOut size={18} />
        <span>Çıkış</span>
    </button>
</div>
```

**Sorun:**
- Kullanıcı adı sadece gösteriliyor, tıklanamıyor
- Çıkış butonu her zaman görünür
- Profil, Ayarlar gibi ek seçenekler yok

---

## ✨ Hedef Durum

**Yeni yapı:**
```tsx
<div className={styles.userMenuWrapper}>
    {/* Tıklanabilir kullanıcı butonu */}
    <button onClick={toggleUserMenu}>
        <User size={18} />
        <span>{user?.username}</span>
        <ChevronDown size={16} /> {/* Aşağı ok ikonu */}
    </button>

    {/* Dropdown menü (açık/kapalı) */}
    {isUserMenuOpen && (
        <div className={styles.dropdownMenu}>
            <Link to="/profile">Profilim</Link>
            <Link to="/library">Kütüphanem</Link>
            <Link to="/settings">Ayarlar</Link>
            <button onClick={handleLogout}>Çıkış Yap</button>
        </div>
    )}
</div>
```

---

## 🔧 Yapılması Gerekenler

### 1. State Ekleme (Menü Açık/Kapalı Kontrolü)

**Dosya:** `Navbar.tsx`

**Eklenecek kod (component'in başına):**
```tsx
import { useState } from 'react';
import { ChevronDown } from 'lucide-react'; // Yeni ikon

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    
    // ✅ YENİ: Dropdown menü durumu
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setIsUserMenuOpen(false); // Menüyü kapat
        navigate('/login');
    };

    // ✅ YENİ: Menüyü aç/kapat
    const toggleUserMenu = () => {
        setIsUserMenuOpen(!isUserMenuOpen);
    };

    // ... rest of the code
};
```

**Açıklama:**
- `isUserMenuOpen`: Menünün açık mı kapalı mı olduğunu tutar (true/false)
- `toggleUserMenu`: Menüyü açar/kapatır
- `handleLogout` güncellendi: Çıkış yaparken menüyü kapatır

---

### 2. JSX Yapısını Değiştirme

**Eski kod (33-42. satırlar):**
```tsx
<div className={styles.userSection}>
    <div className={styles.userInfo}>
        <User size={18} />
        <span>{user?.username}</span>
    </div>
    <button onClick={handleLogout} className={styles.logoutButton}>
        <LogOut size={18} />
        <span>Çıkış</span>
    </button>
</div>
```

**Yeni kod:**
```tsx
<div className={styles.userMenuWrapper}>
    {/* Tıklanabilir kullanıcı butonu */}
    <button 
        onClick={toggleUserMenu} 
        className={styles.userButton}
        aria-label="Kullanıcı menüsü"
    >
        <User size={18} />
        <span>{user?.username}</span>
        <ChevronDown 
            size={16} 
            className={isUserMenuOpen ? styles.chevronUp : styles.chevronDown} 
        />
    </button>

    {/* Dropdown Menü */}
    {isUserMenuOpen && (
        <div className={styles.dropdownMenu}>
            <Link 
                to="/profile" 
                className={styles.dropdownItem}
                onClick={() => setIsUserMenuOpen(false)}
            >
                <User size={16} />
                <span>Profilim</span>
            </Link>
            
            <Link 
                to="/library" 
                className={styles.dropdownItem}
                onClick={() => setIsUserMenuOpen(false)}
            >
                <Library size={16} />
                <span>Kütüphanem</span>
            </Link>
            
            <Link 
                to="/settings" 
                className={styles.dropdownItem}
                onClick={() => setIsUserMenuOpen(false)}
            >
                <Settings size={16} />
                <span>Ayarlar</span>
            </Link>
            
            <div className={styles.dropdownDivider} />
            
            <button 
                onClick={handleLogout} 
                className={styles.dropdownItem}
            >
                <LogOut size={16} />
                <span>Çıkış Yap</span>
            </button>
        </div>
    )}
</div>
```

**Açıklama:**
- **userButton**: Kullanıcı adına tıklanınca menü açılır
- **ChevronDown**: Aşağı ok ikonu (menü açıkken yukarı döner)
- **dropdownMenu**: Sadece `isUserMenuOpen === true` iken görünür
- **dropdownItem**: Her menü öğesi
- **onClick={() => setIsUserMenuOpen(false)}**: Link'e tıklanınca menü kapanır
- **dropdownDivider**: Çıkış butonunu ayıran çizgi

---

### 3. Yeni İkonları Import Etme

**Dosya başına eklenecek:**
```tsx
import { 
    Link, 
    useNavigate 
} from 'react-router-dom';
import { useState } from 'react'; // ✅ YENİ
import { useAuth } from '../../../features/auth/context/authContext';
import { 
    BookOpen, 
    LogOut, 
    User, 
    LogIn,
    ChevronDown,  // ✅ YENİ
    Settings,     // ✅ YENİ
    Library       // ✅ YENİ
} from 'lucide-react';
import styles from '../Navbar.module.css';
```

---

## 🎨 CSS Stilleri

**Dosya:** `Navbar.module.css`

**Eklenecek CSS kodları:**

```css
/* Kullanıcı Menü Wrapper */
.userMenuWrapper {
    position: relative;
}

/* Kullanıcı Butonu */
.userButton {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: transparent;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    color: #334155;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.userButton:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
}

/* Chevron İkonları */
.chevronDown {
    transition: transform 0.3s ease;
}

.chevronUp {
    transform: rotate(180deg);
    transition: transform 0.3s ease;
}

/* Dropdown Menü */
.dropdownMenu {
    position: absolute;
    top: calc(100% + 0.5rem);
    right: 0;
    min-width: 200px;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    padding: 0.5rem;
    z-index: 1000;
    animation: dropdownFadeIn 0.2s ease;
}

@keyframes dropdownFadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Dropdown Öğeleri */
.dropdownItem {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    padding: 0.75rem 1rem;
    background: transparent;
    border: none;
    border-radius: 8px;
    color: #334155;
    font-size: 0.875rem;
    font-weight: 500;
    text-align: left;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.2s ease;
}

.dropdownItem:hover {
    background: #f1f5f9;
    color: #3b82f6;
}

.dropdownItem:last-child {
    color: #ef4444;
}

.dropdownItem:last-child:hover {
    background: #fee2e2;
    color: #dc2626;
}

/* Ayırıcı Çizgi */
.dropdownDivider {
    height: 1px;
    background: #e2e8f0;
    margin: 0.5rem 0;
}
```

**CSS Açıklaması:**

1. **userMenuWrapper**: `position: relative` - Dropdown'ın konumlandırılması için
2. **userButton**: Tıklanabilir kullanıcı butonu stili
3. **chevronDown/Up**: Ok ikonunun dönme animasyonu
4. **dropdownMenu**: 
   - `position: absolute` - Butonun altında görünür
   - `right: 0` - Sağa hizalı
   - `z-index: 1000` - Diğer öğelerin üstünde
   - `animation` - Açılırken yumuşak animasyon
5. **dropdownItem**: Her menü öğesinin stili
6. **dropdownDivider**: Çıkış butonunu ayıran ince çizgi

---

## 🔄 Menüyü Dışarı Tıklayınca Kapatma (Opsiyonel)

Kullanıcı menü dışına tıkladığında menünün kapanması için:

```tsx
import { useState, useEffect, useRef } from 'react';

const Navbar = () => {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Dışarı tıklama kontrolü
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };

        if (isUserMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isUserMenuOpen]);

    return (
        <div className={styles.userMenuWrapper} ref={menuRef}>
            {/* ... menü kodu */}
        </div>
    );
};
```

**Açıklama:**
- `useRef`: Menü elementine referans
- `useEffect`: Tıklama olayını dinler
- `handleClickOutside`: Menü dışına tıklanırsa menüyü kapatır

---

## 📱 Responsive Tasarım (Opsiyonel)

Mobil cihazlarda dropdown menünün tam genişlikte görünmesi için:

```css
@media (max-width: 768px) {
    .dropdownMenu {
        right: -1rem;
        left: -1rem;
        min-width: auto;
        width: calc(100vw - 2rem);
        max-width: 300px;
    }
}
```

---

## 🎯 Özet: Adım Adım Uygulama

### Adım 1: Import'ları Güncelle
```tsx
import { useState } from 'react';
import { ChevronDown, Settings, Library } from 'lucide-react';
```

### Adım 2: State Ekle
```tsx
const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);
```

### Adım 3: JSX'i Değiştir
- `userSection` → `userMenuWrapper`
- `userInfo` + `logoutButton` → `userButton` + `dropdownMenu`

### Adım 4: CSS Ekle
- `.userMenuWrapper`
- `.userButton`
- `.dropdownMenu`
- `.dropdownItem`
- `.dropdownDivider`

### Adım 5: Test Et
- Kullanıcı adına tıkla → Menü açılmalı
- Menü öğelerine tıkla → Sayfaya gitmeli ve menü kapanmalı
- Çıkış yap → Logout olmalı ve menü kapanmalı

---

## 🎨 Görsel Önizleme

### Kapalı Durum:
```
┌─────────────────────────┐
│  👤 kullaniciadi  ▼     │
└─────────────────────────┘
```

### Açık Durum:
```
┌─────────────────────────┐
│  👤 kullaniciadi  ▲     │
└─────────────────────────┘
    ┌──────────────────┐
    │ 👤 Profilim      │
    │ 📚 Kütüphanem    │
    │ ⚙️  Ayarlar      │
    ├──────────────────┤
    │ 🚪 Çıkış Yap     │
    └──────────────────┘
```

---

## ✅ Kontrol Listesi

- [x] `useState` import edildi
- [x] `ChevronDown`, `Settings`, `Library` ikonları import edildi
- [x] `isUserMenuOpen` state'i eklendi
- [x] `toggleUserMenu` fonksiyonu oluşturuldu
- [x] `handleLogout` fonksiyonu güncellendi (menüyü kapatıyor)
- [x] JSX yapısı değiştirildi (`userMenuWrapper` + `dropdownMenu`)
- [x] CSS stilleri eklendi
- [x] Dropdown menü açılıp kapanıyor
- [x] Link'ler çalışıyor
- [x] Çıkış butonu çalışıyor
- [x] (Opsiyonel) Dışarı tıklayınca kapanıyor

---

Bu döküman, mevcut Navbar'ınızı değiştirmeden sadece kullanıcı menüsünü dropdown haline getirmeniz için gereken tüm bilgileri içermektedir. Kodu kendiniz uygulayabilirsiniz!
