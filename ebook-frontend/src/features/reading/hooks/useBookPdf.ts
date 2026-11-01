import { useEffect, useState } from 'react';
import axios from 'axios';
import axiosInstance from '../../../lib/axios';

export type BookPdfStatus = 'loading' | 'ready' | 'forbidden' | 'error';

interface BookPdf {
    url: string;
    status: BookPdfStatus;
}

interface LoadedPdf extends BookPdf {
    bookId: number;
}

const LOADING: BookPdf = { url: '', status: 'loading' };

/**
 * Loads a book's PDF with the Authorization header and exposes it as an object URL, so the JWT never
 * ends up in a URL (browser history, server logs, Referer). A 403 means the plan does not cover the book.
 */
export const useBookPdf = (bookId: number | null, enabled = true): BookPdf => {
    const [loaded, setLoaded] = useState<LoadedPdf | null>(null);

    useEffect(() => {
        if (!enabled || !bookId) return;

        let objectUrl = '';
        let cancelled = false;

        axiosInstance
            .get<Blob>(`/books/view/${bookId}`, { responseType: 'blob' })
            .then((response) => {
                if (cancelled) return;
                objectUrl = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
                setLoaded({ bookId, url: objectUrl, status: 'ready' });
            })
            .catch((error) => {
                if (cancelled) return;
                const forbidden = axios.isAxiosError(error) && error.response?.status === 403;
                setLoaded({ bookId, url: '', status: forbidden ? 'forbidden' : 'error' });
            });

        return () => {
            cancelled = true;
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [bookId, enabled]);

    // A result for another book (or while disabled) counts as "loading" without resetting state in the effect.
    return enabled && loaded?.bookId === bookId ? loaded : LOADING;
};
