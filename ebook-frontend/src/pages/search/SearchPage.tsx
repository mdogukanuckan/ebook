import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDebounce } from '../../hooks/useDebounce';
import { searchBooks } from '../../features/books/services/bookService';
import { getCategories } from '../../features/books/services/categoryService';
import type { Book, BookSearchRequest, Category } from '../../features/books/types';
import { Search, Filter, Loader2, BookX } from 'lucide-react';
// Card components are used as standard divs in this implementation, so no imports needed.

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
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header & Filters */}
                <div className="bg-white p-6 rounded-2xl shadow-sm space-y-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search Input */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Kitap adı, yazar veya ISBN ara..."
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Category Select */}
                        <div className="w-full md:w-64">
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <select
                                    className="w-full pl-10 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
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
                    </div>

                    {/* Status Bar */}
                    <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4 border-gray-100">
                        <span>{totalElements} sonuç bulundu</span>
                        {/* Sort options could go here */}
                    </div>
                </div>

                {/* Results Grid */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    </div>
                ) : books.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {books.map((book) => (
                            <div key={book.id} onClick={() => navigate(`/books/${book.id}`)} className="cursor-pointer group">
                                <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden h-full border border-gray-100">
                                    <div className="aspect-[2/3] bg-gray-100 relative overflow-hidden">
                                        {book.coverImage ? (
                                            <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                                                <BookX className="w-12 h-12 opacity-20" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4 space-y-2">
                                        <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                            {book.title}
                                        </h3>
                                        <p className="text-sm text-gray-500">{book.author.name}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-200">
                        <BookX className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">Sonuç Bulunamadı</h3>
                        <p className="text-gray-500 mt-1">Lütfen arama kriterlerinizi değiştirip tekrar deneyin.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
