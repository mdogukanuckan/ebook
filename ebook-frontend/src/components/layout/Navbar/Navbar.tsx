import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { BookOpen, LogOut, User, ChevronDown, Library, Settings, Search, Menu, X, Heart } from 'lucide-react';
import styles from '../Navbar.module.css';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
            setSearchTerm('');
            setIsMobileMenuOpen(false);
        }
    };

    const handleLogout = () => {
        logout();
        setIsUserMenuOpen(false);
        setIsMobileMenuOpen(false);
        navigate('/login');
    };
    const toggleUserMenu = () => {
        setIsUserMenuOpen(!isUserMenuOpen)
    }

    return (
        <nav className={styles.navbar}>
            <div className={styles.navContainer}>
                <Link to="/" className={styles.logo}>
                    <BookOpen className={styles.logoIcon} />
                    <span className={styles.logoText}>eBookLib</span>
                </Link>

                {user && (
                    <div className={styles.navLinks}>
                        <Link to="/books" className={styles.navLink}>Kitaplar</Link>

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
                )}

                {user && (
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
                                    to="/favorites"
                                    className={styles.dropdownItem}
                                    onClick={() => setIsUserMenuOpen(false)}
                                >
                                    <Heart size={16} className="text-red-500" />
                                    <span>Favorilerim</span>
                                </Link>

                                <Link
                                    to="/settings"
                                    className={styles.dropdownItem}
                                    onClick={() => setIsUserMenuOpen(false)}
                                >
                                    <Settings size={16} />
                                    <span>Ayarlar</span>
                                </Link>

                                {user?.roles.includes('ROLE_ADMIN') && (
                                    <Link
                                        to="/admin"
                                        className={styles.dropdownItem}
                                        onClick={() => setIsUserMenuOpen(false)}
                                    >
                                        <LogOut size={16} className="rotate-180" />
                                        <span>Yönetim Paneli</span>
                                    </Link>
                                )}

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
                )}

                {user && (
                    <button
                        className={styles.mobileToggle}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                )}

                {user && isMobileMenuOpen && (
                    <div className={styles.mobileMenu}>
                        <form onSubmit={handleSearch} className="relative group w-full">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                                placeholder="Kitap ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </form>

                        <Link to="/books" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>
                            Kitaplar
                        </Link>

                        <div className={styles.dropdownDivider} />

                        <div className="flex flex-col gap-1">
                            <div className="px-2 py-2 text-sm font-semibold text-slate-500">
                                {user?.username}
                            </div>
                            <Link to="/profile" className={styles.dropdownItem} onClick={() => setIsMobileMenuOpen(false)}>
                                <User size={16} /> Profilim
                            </Link>
                            <Link to="/library" className={styles.dropdownItem} onClick={() => setIsMobileMenuOpen(false)}>
                                <Library size={16} /> Kütüphanem
                            </Link>
                            <Link to="/favorites" className={styles.dropdownItem} onClick={() => setIsMobileMenuOpen(false)}>
                                <Heart size={16} className="text-red-500" /> Favorilerim
                            </Link>
                            {user?.roles.includes('ROLE_ADMIN') && (
                                <Link to="/admin" className={styles.dropdownItem} onClick={() => setIsMobileMenuOpen(false)}>
                                    <Settings size={16} /> Yönetim Paneli
                                </Link>
                            )}
                            <button onClick={handleLogout} className={styles.dropdownItem}>
                                <LogOut size={16} /> Çıkış Yap
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav >
    );
};

export default Navbar;