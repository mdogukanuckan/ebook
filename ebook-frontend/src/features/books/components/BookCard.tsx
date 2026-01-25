import React from 'react';
import type { Book } from '../types';
import { BookOpen, User } from 'lucide-react';
import styles from './BookCard.module.css';

interface BookCardProps {
    book: Book;
    onClick?: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => {
    return (
        <div
            className={styles.card}
            onClick={() => onClick?.(book)}
        >
            <div className={styles.imageWrapper}>
                {book.coverImage ? (
                    <img
                        src={book.coverImage}
                        alt={book.title}
                        className={styles.coverImage}
                    />
                ) : (
                    <div className={styles.placeholder}>
                        <BookOpen size={48} />
                    </div>
                )}
                <div className={styles.priceTag}>
                    ${(book.price ?? 0).toFixed(2)}
                </div>
            </div>

            <div className={styles.content}>
                <h3 className={styles.title} title={book.title}>
                    {book.title}
                </h3>

                <div className={styles.author}>
                    <User size={16} className="mr-1" />
                    <span className="truncate">{book.author?.name || 'Unknown Author'}</span>
                </div>

                <div className={styles.categories}>
                    {(book.categories || []).slice(0, 3).map((category) => (
                        <span
                            key={category.id}
                            className={styles.category}
                        >
                            {category.name}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

