import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getBookById, deleteBook } from '../../features/books/services/bookService';
import { getReadingProgress } from '../../features/reading/services/progressService';
import { ProgressBar } from '../../features/reading/components/ProgressBar';
import { BookReaderModal } from '../../features/reading/components/BookReaderModal';
import { checkIfFavorite, toggleFavorite } from '../../features/favorites/services/favoriteService';
import { Heart } from 'lucide-react';
import type { Book } from '../../features/books/types';
import type { ReadingProgress } from '../../features/reading/types';
import { BookOpen, Clock, Pencil, Trash2 } from 'lucide-react';
import styles from './BookDetailPage.module.css';
import { getCoverImageUrl } from '../../utils/imageUtils';

import { LoadingScreen } from '../../components/common/LoadingScreen';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addToast } from '../../store/slices/uiSlice';

const BookDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const [book, setBook] = useState<Book | null>(null);
    const [progress, setProgress] = useState<ReadingProgress | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isReadingModalOpen, setIsReadingModalOpen] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);
    const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                setIsLoading(true);
                const [bookData, progressData, favoriteData] = await Promise.all([
                    getBookById(Number(id)),
                    getReadingProgress(Number(id)).catch(() => null),
                    checkIfFavorite(Number(id)).catch(() => false)
                ]);
                setBook(bookData);
                setProgress(progressData);
                setIsFavorited(favoriteData);
            } catch (err) {
                dispatch(addToast({
                    message: 'Failed to load book details.',
                    type: 'error'
                }));
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const { user } = useAppSelector((state) => state.auth);
    const navigate = useNavigate();
    const isAdmin = user?.roles?.includes('ROLE_ADMIN');

    const handleToggleFavorite = async () => {
        if (!book || isFavoriteLoading) return;
        try {
            setIsFavoriteLoading(true);
            await toggleFavorite(book.id);
            setIsFavorited(!isFavorited);
            dispatch(addToast({
                message: isFavorited ? 'Favorilerden çıkarıldı.' : 'Favorilere eklendi.',
                type: 'success'
            }));
        } catch (error) {
            dispatch(addToast({ message: 'İşlem başarısız oldu.', type: 'error' }));
        } finally {
            setIsFavoriteLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!book) return;
        if (window.confirm('Bu kitabı silmek istediğinize emin misiniz?')) {
            try {
                await deleteBook(book.id);
                dispatch(addToast({ message: 'Kitap başarıyla silindi.', type: 'success' }));
                navigate('/admin');
            } catch (error) {
                dispatch(addToast({ message: 'Kitap silinemedi.', type: 'error' }));
            }
        }
    };

    if (isLoading) return <LoadingScreen message="Kitap detayları yükleniyor..." />;
    if (!book) return <div className={styles.error}>Kitap bulunamadı</div>;

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.imageSection}>
                    {book.coverImage ? (
                        <img
                            src={getCoverImageUrl(book.coverImage)}
                            alt={book.title}
                            className={styles.coverImage}
                        />
                    ) : (
                        <div className={styles.placeholderImage}>
                            <BookOpen size={64} />
                        </div>
                    )}
                </div>

                <div className={styles.contentSection}>
                    <div className={styles.header}>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h1 className={styles.bookTitle}>{book.title}</h1>
                                {isAdmin && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => navigate(`/books/${book.id}/edit`)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Düzenle"
                                        >
                                            <Pencil size={20} />
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Sil"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                )}
                                <button
                                    onClick={handleToggleFavorite}
                                    disabled={isFavoriteLoading}
                                    className={`${styles.favoriteButton} ${isFavorited ? styles.favorited : ''}`}
                                    title={isFavorited ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
                                >
                                    <Heart size={24} fill={isFavorited ? 'currentColor' : 'none'} />
                                </button>
                            </div>
                            <p className={styles.authorName}>by {book.author.name}</p>
                        </div>
                        <div className={styles.priceTag}>
                            ${book.price}
                        </div>
                    </div>

                    <div className={styles.tags}>
                        {book.categories.map(cat => (
                            <span key={cat.id} className={styles.tag}>
                                {cat.name}
                            </span>
                        ))}
                    </div>

                    <p className={styles.description}>{book.description}</p>

                    <div className={styles.progressSection}>
                        <h3 className={styles.progressTitle}>Reading Progress</h3>
                        {progress ? (
                            <div className={styles.progressContainer}>
                                <ProgressBar
                                    currentPage={progress.currentPage}
                                    totalPages={progress.totalPages}
                                />
                                <div className={styles.progressFooter}>
                                    <div className={styles.lastRead}>
                                        <Clock size={16} className={styles.clockIcon} />
                                        <span>Last read: {new Date(progress.lastReadAt).toLocaleDateString()}</span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            console.log('Continue Reading clicked');
                                            setIsReadingModalOpen(true);
                                        }}
                                        className={styles.continueButton}
                                    >
                                        Continue Reading
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => {
                                    console.log('Start Reading clicked');
                                    setIsReadingModalOpen(true);
                                }}
                                className={styles.startReadingButton}
                            >
                                <BookOpen size={20} className={styles.bookIcon} />
                                <span className="ml-2">Start Reading</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {book && (
                <BookReaderModal
                    isOpen={isReadingModalOpen}
                    onClose={() => setIsReadingModalOpen(false)}
                    bookId={book.id}
                    bookTitle={book.title}
                />
            )}
        </div>
    );
};

export default BookDetailPage;
