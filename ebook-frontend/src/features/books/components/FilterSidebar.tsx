import React, { useEffect, useState } from 'react';
import { getAuthors } from '../services/authorService';
import { getCategories } from '../services/categoryService';
import type { Author, Category, BookSearchRequest } from '../types';
import { Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import styles from './FilterSidebar.module.css';

interface FilterSidebarProps {
    filters: BookSearchRequest;
    onFilterChange: (filters: BookSearchRequest) => void;
    onClearFilters: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
    filters,
    onFilterChange,
    onClearFilters
}) => {
    const [authors, setAuthors] = useState<Author[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);
    const [isAuthorsOpen, setIsAuthorsOpen] = useState(true);

    useEffect(() => {
        const loadOptions = async () => {
            try {
                const [authorsData, categoriesData] = await Promise.all([
                    getAuthors(),
                    getCategories()
                ]);
                setAuthors(authorsData);
                setCategories(categoriesData);
            } catch (err) {
                console.error('Failed to load filter options', err);
            }
        };
        loadOptions();
    }, []);

    const toggleCategory = (id: number) => {
        const current = filters.categoryIds || [];
        const next = current.includes(id)
            ? current.filter(cid => cid !== id)
            : [...current, id];
        onFilterChange({ ...filters, categoryIds: next });
    };

    const toggleAuthor = (id: number) => {
        const current = filters.authorIds || [];
        const next = current.includes(id)
            ? current.filter(aid => aid !== id)
            : [...current, id];
        onFilterChange({ ...filters, authorIds: next });
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.header}>
                <div className="flex items-center gap-2">
                    <Filter size={20} />
                    <h2 className="font-bold">Filtreler</h2>
                </div>
                <button onClick={onClearFilters} className={styles.clearButton}>
                    Temizle
                </button>
            </div>

            <div className={styles.section}>
                <div className={styles.searchBox}>
                    <Search className={styles.searchIcon} size={18} />
                    <input
                        type="text"
                        placeholder="Kitap veya ISBN ara..."
                        value={filters.query || ''}
                        onChange={(e) => onFilterChange({ ...filters, query: e.target.value })}
                        className={styles.searchInput}
                    />
                </div>
            </div>

            <div className={styles.section}>
                <button
                    className={styles.sectionTitle}
                    onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                >
                    Kategoriler
                    {isCategoriesOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {isCategoriesOpen && (
                    <div className={styles.optionsList}>
                        {categories.map(cat => (
                            <label key={cat.id} className={styles.option}>
                                <input
                                    type="checkbox"
                                    checked={(filters.categoryIds || []).includes(cat.id)}
                                    onChange={() => toggleCategory(cat.id)}
                                />
                                <span>{cat.name}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            <div className={styles.section}>
                <button
                    className={styles.sectionTitle}
                    onClick={() => setIsAuthorsOpen(!isAuthorsOpen)}
                >
                    Yazarlar
                    {isAuthorsOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {isAuthorsOpen && (
                    <div className={styles.optionsList}>
                        {authors.map(author => (
                            <label key={author.id} className={styles.option}>
                                <input
                                    type="checkbox"
                                    checked={(filters.authorIds || []).includes(author.id)}
                                    onChange={() => toggleAuthor(author.id)}
                                />
                                <span>{author.name}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>
        </aside>
    );
};
