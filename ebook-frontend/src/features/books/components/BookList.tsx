import React from 'react';
import { BookCard } from './BookCard';
import type { Book } from '../types';
import styles from './BookList.module.css';
import { useNavigate } from 'react-router-dom';

interface BookListProps {
    books: Book[];
    isLoading?: boolean;
    onBookClick?: (book: Book) => void;
}

export const BookList: React.FC<BookListProps> = ({ books, isLoading = false, onBookClick }) => {
    const navigate = useNavigate();

    if (isLoading) {
        return <div className={styles.loadingState}>Loading books...</div>;
    }

    if (!books || books.length === 0) {
        return <div className={styles.emptyState}>No books found.</div>;
    }

    return (
        <div className={styles.grid}>
            {books.map((book) => (
                <BookCard
                    key={book.id}
                    book={book}
                    onClick={onBookClick || ((b) => navigate(`/books/${b.id}`))}
                />
            ))}
        </div>
    );
};
