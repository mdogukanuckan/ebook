import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { config } from '../../config/environment';
import { getBookById } from '../../features/books/services/bookService';
import { getReadingProgress, updateReadingProgress } from '../../features/reading/services/progressService';
import type { Book } from '../../features/books/types';
import { useAppDispatch } from '../../store/hooks';
import { addToast } from '../../store/slices/uiSlice';

const ReadBookPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [pdfUrl, setPdfUrl] = useState<string>('');
    const [book, setBook] = useState<Book | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [isSaving, setIsSaving] = useState(false);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('accessToken');
            if (id && token) {
                setPdfUrl(`${config.apiBaseUrl}/books/view/${id}?token=${token}`);
                try {
                    const [bookData, progressData] = await Promise.all([
                        getBookById(Number(id)),
                        getReadingProgress(Number(id)).catch(() => null)
                    ]);
                    setBook(bookData);
                    if (progressData) {
                        setCurrentPage(progressData.currentPage);
                    }
                } catch (error) {
                    console.error('Data fetch error:', error);
                }
            }
        };
        fetchData();
    }, [id]);

    const handleSaveProgress = async () => {
        if (!id || !book) return;
        try {
            setIsSaving(true);
            await updateReadingProgress(Number(id), currentPage);
            dispatch(addToast({ message: 'İlerleme kaydedildi.', type: 'success' }));
        } catch (error) {
            dispatch(addToast({ message: 'Kaydedilirken hata oluştu.', type: 'error' }));
        } finally {
            setIsSaving(false);
        }
    };

    if (!pdfUrl) return null;

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-100">
            <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span className="font-medium">Geri Dön</span>
                    </button>
                    <div className="h-6 w-px bg-slate-200" />
                    <div>
                        <h1 className="font-bold text-slate-800 leading-tight">{book?.title || 'Yükleniyor...'}</h1>
                        <p className="text-xs text-slate-500">{book?.author.name}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
                        <span className="text-sm text-slate-600 font-medium whitespace-nowrap">Sayfa:</span>
                        <input
                            type="number"
                            value={currentPage}
                            onChange={(e) => setCurrentPage(Math.max(0, Math.min(book?.pageCount || 9999, Number(e.target.value))))}
                            className="w-16 bg-white border border-slate-200 rounded px-2 py-0.5 text-sm font-bold text-center focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                        <span className="text-sm text-slate-400">/ {book?.pageCount || '?'}</span>
                    </div>

                    <button
                        onClick={handleSaveProgress}
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-sm"
                    >
                        {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        <span>Kaydet</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 p-4 overflow-hidden">
                <div className="w-full h-full bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
                    <iframe
                        src={pdfUrl}
                        className="w-full h-full"
                        title="Kitap Okuyucu"
                    />
                </div>
            </div>
        </div>
    );
};

export default ReadBookPage;
