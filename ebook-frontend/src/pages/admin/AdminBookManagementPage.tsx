import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getBooks, deleteBook } from '../../features/books/services/bookService';
import type { Book } from '../../features/books/types';
import styles from './AdminBookManagementPage.module.css';
import { Plus, Edit, Trash2, Search, Loader2, BookOpen } from 'lucide-react';
import { useAppDispatch } from '../../store/hooks';
import { addToast } from '../../store/slices/uiSlice';

const AdminBookManagementPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadBooks();
    }, []);

    const loadBooks = async () => {
        try {
            setLoading(true);
            const data = await getBooks();
            setBooks(data);
        } catch (error) {
            console.error('Failed to load books', error);
            dispatch(addToast({ message: 'Kitap listesi yüklenemedi.', type: 'error' }));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Bu kitabı silmek istediğinizden emin misiniz?')) return;

        try {
            await deleteBook(id);
            dispatch(addToast({ message: 'Kitap başarıyla silindi.', type: 'success' }));
            setBooks(books.filter(b => b.id !== id));
        } catch (error) {
            dispatch(addToast({ message: 'Kitap silinemedi.', type: 'error' }));
        }
    };

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Kitap Yönetimi</h1>
                    <p className={styles.description}>
                        Sistemdeki tüm kitapları görüntüleyin, ekleyin veya düzenleyin.
                    </p>
                </div>
                <Link to="/books/new" className={styles.addButton}>
                    <Plus size={20} />
                    <span>Yeni Kitap Ekle</span>
                </Link>
            </div>

            <div className={styles.searchBar}>
                <div className={styles.searchInner}>
                    <Search className={styles.searchIcon} size={20} />
                    <input
                        type="text"
                        placeholder="Kitap başlığı veya yazar ara..."
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Kitap</th>
                            <th>Yazar</th>
                            <th>Kategoriler</th>
                            <th>Fiyat</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBooks.map(book => (
                            <tr key={book.id}>
                                <td>
                                    <div className={styles.bookInfo}>
                                        <div className={styles.coverWrapper}>
                                            {book.coverImage ? (
                                                <img
                                                    src={`${import.meta.env.VITE_API_URL}/books/covers/${book.coverImage.split('/').pop()}`}
                                                    alt={book.title}
                                                    className={styles.coverThumbnail}
                                                />
                                            ) : (
                                                <div className={styles.placeholderCover}>
                                                    <BookOpen size={16} />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-slate-900">{book.title}</div>
                                            <div className="text-xs text-slate-500">ID: {book.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>{book.author.name}</td>
                                <td>
                                    <div className={styles.categoryList}>
                                        {book.categories.map(cat => (
                                            <span key={cat.id} className={styles.categoryBadge}>
                                                {cat.name}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="font-medium">${book.price.toFixed(2)}</td>
                                <td>
                                    <div className={styles.actions}>
                                        <button
                                            className={`${styles.actionButton} ${styles.editButton}`}
                                            onClick={() => navigate(`/admin/books/edit/${book.id}`)}
                                            title="Düzenle"
                                        >
                                            <Edit size={18} />
                                        </button>

                                        <button
                                            className={`${styles.actionButton} ${styles.dangerButton}`}
                                            onClick={() => handleDelete(book.id)}
                                            title="Sil"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredBooks.length === 0 && (
                            <tr>
                                <td colSpan={5} className={styles.emptyCell}>
                                    Kitap bulunamadı.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminBookManagementPage;
