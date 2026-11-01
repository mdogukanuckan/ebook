import React from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Lock, AlertCircle } from 'lucide-react';
import type { BookPdfStatus } from '../hooks/useBookPdf';

interface BookPdfNoticeProps {
    status: Exclude<BookPdfStatus, 'ready'>;
}

export const BookPdfNotice: React.FC<BookPdfNoticeProps> = ({ status }) => {
    if (status === 'loading') {
        return (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-slate-600">
                <Loader2 className="animate-spin text-blue-500" size={36} />
                <span>Kitap yükleniyor...</span>
            </div>
        );
    }

    if (status === 'forbidden') {
        return (
            <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
                <Lock className="text-amber-500" size={40} />
                <h2 className="text-xl font-bold text-slate-800">Bu kitaba erişiminiz yok</h2>
                <p className="max-w-md text-slate-600">
                    Bu kitabı okumak için planınızın yükseltilmesi gerekiyor.
                </p>
                <Link
                    to="/subscription"
                    className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-blue-700"
                >
                    Abonelik planlarını gör
                </Link>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
            <AlertCircle className="text-red-500" size={40} />
            <h2 className="text-xl font-bold text-slate-800">Kitap yüklenemedi</h2>
            <p className="text-slate-600">Lütfen daha sonra tekrar deneyin.</p>
        </div>
    );
};
