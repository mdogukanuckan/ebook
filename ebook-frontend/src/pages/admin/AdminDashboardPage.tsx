import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Book, Users, BarChart3 } from 'lucide-react';
import styles from './AdminDashboardPage.module.css';
import { getBooks } from '../../features/books/services/bookService';

const AdminDashboardPage: React.FC = () => {
    const [bookCount, setBookCount] = useState<number | string>('-');

    useEffect(() => {
        // Simple fetch to show real data
        getBooks().then(books => setBookCount(books.length)).catch(() => setBookCount(0));
    }, []);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Yönetim Paneli</h1>

            <div className={styles.grid}>
                {/* Book Management Card */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <div className={`${styles.iconWrapper} ${styles.blueIcon}`}>
                            <Book size={24} />
                        </div>
                        <h2 className={styles.cardTitle}>Kitap Yönetimi</h2>
                    </div>
                    <p className={styles.cardDescription}>Kitapları, yazarları ve kategorileri buradan ekleyip yönetebilirsiniz.</p>
                    <div className={styles.actionList}>
                        <Link to="/books/new" className={styles.actionLink}>
                            <Plus size={18} />
                            Yeni Kitap Ekle
                        </Link>
                        <Link to="/authors/new" className={styles.actionLink}>
                            <Plus size={18} />
                            Yeni Yazar Ekle
                        </Link>
                        <Link to="/categories/new" className={styles.actionLink}>
                            <Plus size={18} />
                            Yeni Kategori Ekle
                        </Link>
                    </div>
                </div>

                {/* User Management Card */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <div className={`${styles.iconWrapper} ${styles.greenIcon}`}>
                            <Users size={24} />
                        </div>
                        <h2 className={styles.cardTitle}>Kullanıcılar</h2>
                    </div>
                    <p className={styles.cardDescription}>Sistem kullanıcılarını ve rollerini yönetin.</p>
                    <div className={styles.actionList}>
                        <button className={`${styles.actionButton} ${styles.disabledButton}`}>
                            Kullanıcı Yönetimi (Yakında)
                        </button>
                        <button className={`${styles.actionButton} ${styles.disabledButton}`}>
                            Abonelik Planları (Yakında)
                        </button>
                    </div>
                </div>

                {/* Analytics Card */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <div className={`${styles.iconWrapper} ${styles.purpleIcon}`}>
                            <BarChart3 size={24} />
                        </div>
                        <h2 className={styles.cardTitle}>Analitik</h2>
                    </div>
                    <p className={styles.cardDescription}>Sistem istatistikleri ve raporlar.</p>
                    <div className="mt-auto">
                        <div className={styles.statValue}>{bookCount}</div>
                        <p className={styles.statLabel}>Toplam Kitap</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
