import { useAuth } from '../../features/auth/context/authContext';
import { Library, BookOpen, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const LibraryPage = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-4">
                        <Link
                            to="/"
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Ana Sayfaya Dön"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </Link>
                        <div className="flex items-center gap-3">
                            <Library className="w-8 h-8 text-purple-600" />
                            <h1 className="text-2xl font-bold text-gray-900">Kütüphanem</h1>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full">
                        <BookOpen className="w-10 h-10 text-purple-600" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-gray-900">Kütüphane Sayfası</h2>
                        <p className="text-gray-600">
                            Merhaba {user?.firstName || user?.username}, kütüphane özellikleri yakında eklenecek!
                        </p>
                    </div>
                    <div className="pt-4">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Ana Sayfaya Dön
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LibraryPage;
