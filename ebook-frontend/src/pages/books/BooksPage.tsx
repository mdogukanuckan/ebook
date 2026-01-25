import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { BookList } from '../../features/books/components/BookList';
import { getBooks } from '../../features/books/services/bookService';
import type { Book } from '../../features/books/types';

const BooksPage: React.FC = () => {
    // ... content

    const [books, setBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const data = await getBooks();
                setBooks(data);
            } catch (err) {
                setError('Failed to load books. Please try again later.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBooks();
    }, []);

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-500">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 text-blue-600 hover:underline"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Library</h1>
                <Link
                    to="/books/new"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center"
                >
                    <PlusCircle size={20} className="mr-2" />
                    Add New Book
                </Link>
            </div>
            <BookList books={books} isLoading={isLoading} />
        </div>
    );
};

export default BooksPage;
