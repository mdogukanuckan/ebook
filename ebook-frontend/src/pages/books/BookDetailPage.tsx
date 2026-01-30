import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBookById } from '../../features/books/services/bookService';
import { getReadingProgress } from '../../features/reading/services/progressService';
import { ProgressBar } from '../../features/reading/components/ProgressBar';
import type { Book } from '../../features/books/types';
import type { ReadingProgress } from '../../features/reading/types';
import { BookOpen, Clock } from 'lucide-react';
import styles from './BookDetailPage.module.css';
import { getCoverImageUrl } from '../../utils/imageUtils';
import { config } from '../../config/environment';

import { LoadingScreen } from '../../components/common/LoadingScreen';
import { useAppDispatch } from '../../store/hooks';
import { addToast } from '../../store/slices/uiSlice';

const BookDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const [book, setBook] = useState<Book | null>(null);
    const [progress, setProgress] = useState<ReadingProgress | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                setIsLoading(true);
                const [bookData, progressData] = await Promise.all([
                    getBookById(Number(id)),
                    getReadingProgress(Number(id)).catch(() => null) // Ignore progress error if not started
                ]);
                setBook(bookData);
                setProgress(progressData);
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
                        <div>
                            <h1 className={styles.bookTitle}>{book.title}</h1>
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
                                            const token = localStorage.getItem('accessToken');
                                            window.open(`${config.apiBaseUrl}/books/view/${book.id}?token=${token}`, '_blank');
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
                                    const token = localStorage.getItem('accessToken');
                                    window.open(`${config.apiBaseUrl}/books/view/${book.id}?token=${token}`, '_blank');
                                }}
                                className={styles.startReadingButton}
                            >
                                <BookOpen size={20} className={styles.bookIcon} />
                                Start Reading
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetailPage;
