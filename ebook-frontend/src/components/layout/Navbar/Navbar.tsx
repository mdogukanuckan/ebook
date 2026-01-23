import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../features/auth/context/authContext';
import { BookOpen, LogOut, User, LogIn, ChevronDown, Library, Settings } from 'lucide-react';
import styles from '../Navbar.module.css';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setIsUserMenuOpen(false);
        navigate('/login');
    };
    const toggleUserMenu = () => {
        setIsUserMenuOpen(!isUserMenuOpen)
    }

    return (
        <nav className={styles.navbar}>
            <div className={styles.navContainer}>
                {/* Logo Bölümü */}
                <Link to="/" className={styles.logo}>
                    <BookOpen className={styles.logoIcon} />
                    <span className={styles.logoText}>eBookLib</span>
                </Link>

                {/* Menü Linkleri */}
                <div className={styles.navLinks}>
                    <Link to="/books" className={styles.navLink}>Kitaplar</Link>
                    <Link to="/categories" className={styles.navLink}>Kategoriler</Link>
                </div>

                {/* Kullanıcı Aksiyonları */}
                <div className={styles.userMenuWrapper}>
                    <button onClick={toggleUserMenu}
                        className={styles.userButton}
                        aria-label="Kullanıcı menüsü">
                        <User size={18} />
                        <span>{user?.username}</span>
                        <ChevronDown
                            size={16}
                            className={isUserMenuOpen ? styles.chevronUp : styles.chevronDown}
                        />
                    </button>
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
            </div>
        </nav>
    );
};

export default Navbar;