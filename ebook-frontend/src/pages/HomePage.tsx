import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { BookList } from '../features/books/components/BookList';
import { getBooks } from '../features/books/services/bookService';
import type { Book } from '../features/books/types';
import { BookOpen, Sparkles } from 'lucide-react';
import styles from './HomePage.module.css';

const HomePage = () => {
    const { user } = useAuth();
    const [books, setBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                
                const data = await getBooks();
                setBooks(data);
            } catch (err) {
                console.error('Failed to load books', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBooks();
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.heroSection}>
                <div className={styles.heroContent}>
                    <div className={styles.brandLabel}>
                        <BookOpen size={16} />
                        <span>eBook Kütüphanesi</span>
                    </div>
                    <h1 className={styles.welcomeTitle}>
                        Hoş Geldin, <br />
                        <span>{user?.firstName || user?.username}!</span>
                    </h1>
                    <p className={styles.welcomeSubset}>
                        Bugün ne okumak istersin? Senin için özenle seçilmiş en yeni kitaplara ve popüler içeriklere göz at.
                    </p>
                </div>
            </div>

            <main className={styles.mainContent}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>
                        <Sparkles className={styles.sectionTitleIcon} size={24} />
                        Öne Çıkan Kitaplar
                    </h2>
                </div>

                <BookList books={books} isLoading={isLoading} />
            </main>
        </div>
    );
};

export default HomePage;
