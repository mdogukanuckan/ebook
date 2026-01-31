import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { config } from '../../config/environment';

const ReadBookPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [pdfUrl, setPdfUrl] = useState<string>('');

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (id && token) {
            setPdfUrl(`${config.apiBaseUrl}/books/view/${id}?token=${token}`);
        }
    }, [id]);

    if (!pdfUrl) return null;

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-100">
            <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center shadow-sm">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span className="font-medium">Geri Dön</span>
                </button>
            </div>

            <div className="flex-1 p-4">
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
