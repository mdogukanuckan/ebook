import { Link } from 'react-router-dom';
import { Home, Search, AlertTriangle } from 'lucide-react';

const NotFoundPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center space-y-8">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-24 h-24 bg-yellow-100 rounded-full">
                    <AlertTriangle className="w-12 h-12 text-yellow-600" />
                </div>

                {/* Content */}
                <div className="space-y-4">
                    <h1 className="text-6xl font-bold text-gray-900">404</h1>
                    <h2 className="text-2xl font-semibold text-gray-800">Sayfa Bulunamadı</h2>
                    <p className="text-gray-600">
                        Aradığınız sayfa mevcut değil veya taşınmış olabilir.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-blue-500/30"
                    >
                        <Home className="w-5 h-5" />
                        Ana Sayfaya Dön
                    </Link>
                    <Link
                        to="/library"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition-colors border border-gray-300"
                    >
                        <Search className="w-5 h-5" />
                        Kütüphaneye Git
                    </Link>
                </div>

                {/* Additional Info */}
                <p className="text-sm text-gray-500 pt-8">
                    Hata kodu: <span className="font-mono font-semibold">404 - NOT_FOUND</span>
                </p>
            </div>
        </div>
    );
};

export default NotFoundPage;
