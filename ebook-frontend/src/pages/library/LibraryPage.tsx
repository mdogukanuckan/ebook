import React, { useEffect, useState } from 'react';
import { getUserProgressList } from '../../features/reading/services/progressService';
import type { ReadingProgress } from '../../features/reading/types';
import { Library, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProgressBar } from '../../features/reading/components/ProgressBar';
import styles from './LibraryPage.module.css';
import { useAppDispatch } from '../../store/hooks';
import { addToast } from '../../store/slices/uiSlice';

const LibraryPage: React.FC = () => {
    const [progressList, setProgressList] = useState<ReadingProgress[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        loadLibrary();
    }, []);

    const loadLibrary = async () => {
        try {
            setLoading(true);
            const data = await getUserProgressList();
            setProgressList(data);
        } catch (error) {
            dispatch(addToast({ message: 'Kütüphane yüklenemedi.', type: 'error' }));
        } finally {
            setLoading(false);
        }
    };

    const inProgress = progressList.filter(p => !p.isCompleted);
    const completed = progressList.filter(p => p.isCompleted);

    if (loading) {
        return (
            <div className="flex justify-center p-20">
                <Loader2 className="animate-spin text-blue-500" size={40} />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Library className="text-blue-600" size={32} />
                <h1 className={styles.title}>Kütüphanem</h1>
            </div>

            {progressList.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>Henüz okumaya başladığınız bir kitap bulunmuyor.</p>
                    <button onClick={() => navigate('/books')} className={styles.browseButton}>
                        Okumaya Başla
                    </button>
                </div>
            ) : (
                <div className={styles.sections}>
                    {inProgress.length > 0 && (
                        <section className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <Clock size={20} className="text-orange-500" />
                                <h2>Okumaya Devam Et</h2>
                            </div>
                            <div className={styles.grid}>
                                {inProgress.map(item => (
                                    <div
                                        key={item.id}
                                        className={styles.card}
                                        onClick={() => navigate(`/books/${item.bookId}`)}
                                    >
                                        <div className={styles.cardContent}>
                                            <h3 className={styles.bookTitle}>{item.bookTitle}</h3>
                                            <div className={styles.progressInfo}>
                                                <ProgressBar
                                                    currentPage={item.currentPage}
                                                    totalPages={item.totalPages}
                                                />
                                                <p className={styles.stats}>
                                                    {item.currentPage} / {item.totalPages} sayfa
                                                    <span> ({Math.round(item.percentage)}%)</span>
                                                </p>
                                            </div>
                                            <button
                                                className={styles.readButton}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/read/${item.bookId}`);
                                                }}
                                            >
                                                Okumaya Devam Et
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {completed.length > 0 && (
                        <section className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <CheckCircle size={20} className="text-green-500" />
                                <h2>Tamamlananlar</h2>
                            </div>
                            <div className={styles.grid}>
                                {completed.map(item => (
                                    <div
                                        key={item.id}
                                        className={`${styles.card} ${styles.completedCard}`}
                                        onClick={() => navigate(`/books/${item.bookId}`)}
                                    >
                                        <div className={styles.cardContent}>
                                            <h3 className={styles.bookTitle}>{item.bookTitle}</h3>
                                            <p className={styles.stats}>Tamamlandı</p>
                                            <button
                                                className={styles.readButton}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/read/${item.bookId}`);
                                                }}
                                            >
                                                Tekrar Oku
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            )}
        </div>
    );
};

export default LibraryPage;
