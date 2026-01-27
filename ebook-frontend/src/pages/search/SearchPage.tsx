import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDebounce } from '../../hooks/useDebounce';
import { searchBooks } from '../../features/books/services/bookService';
import { getCategories } from '../../features/books/services/categoryService';
import type { Book, BookSearchRequest, Category } from '../../features/books/types';
import { Search, Filter, Loader2, BookX } from 'lucide-react';
import styles from './SearchPage.module.css';
import { getCoverImageUrl } from '../../utils/imageUtils';

const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // State
    const [books, setBooks] = useState<Book[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalElements, setTotalElements] = useState(0);

    // Filters from URL
    const query = searchParams.get('q') || '';
    const categoryId = searchParams.get('cat');
    const sort = searchParams.get('sort') || '';

    // Local state for input to allow typing before debounce kicks URL update
    const [searchTerm, setSearchTerm] = useState(query);
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    // 1. Sync Debounced Input to URL
    useEffect(() => {
        if (debouncedSearchTerm !== query) {
            handleFilterChange('q', debouncedSearchTerm);
        }
    }, [debouncedSearchTerm]);

    // 2. Fetch Categories on Mount
    useEffect(() => {
        getCategories().then(setCategories).catch(console.error);
    }, []);

    // 3. Fetch Books when URL Params Change
    useEffect(() => {
        const fetchBooks = async () => {
            setIsLoading(true);
            try {
                const request: BookSearchRequest = {
                    query: query,
                    categoryIds: categoryId ? [Number(categoryId)] : [],
                    sort: sort // Pass sort string if backend supports it directly or map it
                };

                // Backend sort param might need mapping. Passing raw for now.
                const response = await searchBooks(request, 0, 20);
                setBooks(response.content);
                setTotalElements(response.totalElements);
            } catch (error) {
                console.error("Search failed", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBooks();
    }, [query, categoryId, sort]);

    const handleFilterChange = (key: string, value: string) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        setSearchParams(newParams);
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.contentWrapper}>

                {/* Header & Filters */}
                <div className={styles.filterSection}>
                    <div className={styles.controlsRow}>
                        {/* Search Input */}
                        <div className={styles.searchGroup}>
                            <Search className={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder="Kitap adı, yazar veya ISBN ara..."
                                className={styles.searchInput}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Category Select */}
                        <div className={styles.categoryGroup}>
                            <Filter className={styles.filterIcon} />
                            <select
                                className={styles.selectInput}
                                value={categoryId || ''}
                                onChange={(e) => handleFilterChange('cat', e.target.value)}
                            >
                                <option value="">Tüm Kategoriler</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Status Bar */}
                    <div className={styles.statusBar}>
                        <span>{totalElements} sonuç bulundu</span>
                        {/* Sort options could go here */}
                    </div>
                </div>

                {/* Results Grid */}
                {isLoading ? (
                    <div className={styles.loadingContainer}>
                        <Loader2 className={styles.spinner} size={32} />
                    </div>
                ) : books.length > 0 ? (
                    <div className={styles.grid}>
                        {books.map((book) => (
                            <div key={book.id} onClick={() => navigate(`/books/${book.id}`)} className={styles.card}>
                                <div className={styles.cardImageWrapper}>
                                    {book.coverImage ? (
                                        <img src={getCoverImageUrl(book.coverImage)} alt={book.title} className={styles.bookImage} />
                                    ) : (
                                        <div className={styles.placeholderImage}>
                                            <BookX size={48} opacity={0.3} />
                                        </div>
                                    )}
                                </div>
                                <div className={styles.cardContent}>
                                    <h3 className={styles.bookTitle} title={book.title}>
                                        {book.title}
                                    </h3>
                                    <p className={styles.authorName}>{book.author.name}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <BookX size={48} className={styles.emptyIcon} />
                        <h3 className={styles.emptyTitle}>Sonuç Bulunamadı</h3>
                        <p>Lütfen arama kriterlerinizi değiştirip tekrar deneyin.</p>
                    </div>
                )}
            </div>
        </div >
    );
};

export default SearchPage;
