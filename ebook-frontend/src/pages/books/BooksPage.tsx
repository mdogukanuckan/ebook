import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { BookList } from '../../features/books/components/BookList';
import { FilterSidebar } from '../../features/books/components/FilterSidebar';
import { searchBooks } from '../../features/books/services/bookService';
import type { Book, BookSearchRequest } from '../../features/books/types';
import styles from './BooksPage.module.css';

const BooksPage: React.FC = () => {
    // ... content

    const [books, setBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<BookSearchRequest>({
        query: '',
        categoryIds: [],
        authorIds: [],
        sort: ''
    });

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setIsLoading(true);
                // We use searchBooks with our filters
                const data = await searchBooks(filters);
                setBooks(data.content);
                setError(null);
            } catch (err) {
                setError('Kitaplar yüklenirken bir hata oluştu.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        // Debounce search for query
        const timer = setTimeout(() => {
            fetchBooks();
        }, 300);

        return () => clearTimeout(timer);
    }, [filters]);

    const clearFilters = () => {
        setFilters({
            query: '',
            categoryIds: [],
            authorIds: [],
            sort: ''
        });
    };

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-500">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 text-blue-600 hover:underline"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Kütüphane</h1>
                    <p className={styles.subtitle}>{books.length} kitap bulundu</p>
                </div>
                <Link to="/books/new" className={styles.addButton}>
                    <PlusCircle size={20} />
                    Yeni Kitap Ekle
                </Link>
            </div>

            <div className={styles.layout}>
                <FilterSidebar
                    filters={filters}
                    onFilterChange={setFilters}
                    onClearFilters={clearFilters}
                />

                <main className={styles.mainContent}>
                    {error ? (
                        <div className={styles.errorBox}>
                            <p>{error}</p>
                            <button onClick={clearFilters} className="text-blue-500 underline mt-2">
                                Filtreleri Sıfırla
                            </button>
                        </div>
                    ) : (
                        <BookList books={books} isLoading={isLoading} />
                    )}
                </main>
            </div>
        </div>
    );
};

export default BooksPage;
