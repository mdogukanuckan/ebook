import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookById } from '../../features/books/services/bookService';
import type { Book } from '../../features/books/types';
import { BookForm } from '../../features/books/components/BookForm';
import { Loader2, ArrowLeft } from 'lucide-react';
import styles from './EditBookPage.module.css';

const EditBookPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchBook(Number(id));
        }
    }, [id]);

    const fetchBook = async (bookId: number) => {
        try {
            setLoading(true);
            const data = await getBookById(bookId);
            setBook(data);
        } catch (error) {
            console.error('Failed to fetch book', error);
            navigate('/admin/books');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
        );
    }

    if (!book) return null;

    return (
        <div className={styles.container}>
            <button onClick={() => navigate(-1)} className={styles.backButton}>
                <ArrowLeft size={20} />
                <span>Geri Dön</span>
            </button>
            <BookForm initialData={book} isEdit={true} />
        </div>
    );
};

export default EditBookPage;
