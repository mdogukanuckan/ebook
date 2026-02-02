import React, { useEffect, useState } from 'react';
import { getFavorites, toggleFavorite } from '../../features/favorites/services/favoriteService';
import type { FavoriteItem } from '../../features/favorites/services/favoriteService';
import { Heart, Trash2, BookOpen, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './FavoritesPage.module.css';
import { useAppDispatch } from '../../store/hooks';
import { addToast } from '../../store/slices/uiSlice';
import { getCoverImageUrl } from '../../utils/imageUtils';

const FavoritesPage: React.FC = () => {
    const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        try {
            setLoading(true);
            const data = await getFavorites();
            setFavorites(data);
        } catch (error) {
            dispatch(addToast({ message: 'Favoriler yüklenemedi.', type: 'error' }));
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (e: React.MouseEvent, bookId: number) => {
        e.stopPropagation();
        try {
            await toggleFavorite(bookId);
            setFavorites(favorites.filter(f => f.bookId !== bookId));
            dispatch(addToast({ message: 'Favorilerden çıkarıldı.', type: 'success' }));
        } catch (error) {
            dispatch(addToast({ message: 'Hata oluştu.', type: 'error' }));
        }
    };

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
                <Heart className="text-red-500 fill-red-500" size={32} />
                <h1 className={styles.title}>Favorilerim</h1>
            </div>

            {favorites.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>Henüz favori kitabınız bulunmuyor.</p>
                    <button onClick={() => navigate('/books')} className={styles.browseButton}>
                        Kitaplara Göz At
                    </button>
                </div>
            ) : (
                <div className={styles.grid}>
                    {favorites.map(item => (
                        <div
                            key={item.id}
                            className={styles.card}
                            onClick={() => navigate(`/books/${item.bookId}`)}
                        >
                            <div className={styles.coverWrapper}>
                                {item.bookCoverImage ? (
                                    <img
                                        src={getCoverImageUrl(item.bookCoverImage)}
                                        alt={item.bookTitle}
                                        className={styles.coverImage}
                                    />
                                ) : (
                                    <div className={styles.placeholder}>
                                        <BookOpen size={32} />
                                    </div>
                                )}
                                <button
                                    className={styles.removeButton}
                                    onClick={(e) => handleRemove(e, item.bookId)}
                                    title="Favorilerden çıkar"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            <div className={styles.info}>
                                <h3 className={styles.bookTitle}>{item.bookTitle}</h3>
                                <p className={styles.authorName}>{item.authorName}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FavoritesPage;
