import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { BookOpen, LogOut, User, ChevronDown, Library, Settings, Search } from 'lucide-react';
import styles from '../Navbar.module.css';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
            // Optional: Don't clear search term so user sees what they searched, or clear it.
            // Keeping it might be better UX, but let's clear for now as it navigates away.
            setSearchTerm('');
        }
    };

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

                    {/* Arama Çubuğu */}
                    <form onSubmit={handleSearch} className="relative group ml-4">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 sm:text-sm transition-all duration-300 ease-in-out w-40 focus:w-64"
                            placeholder="Kitap ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </form>
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