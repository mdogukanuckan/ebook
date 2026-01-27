import { useAuth } from '../hooks/useAuth';
import { LogOut, BookOpen, Library } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <BookOpen className="w-8 h-8 text-blue-600" />
                            <h1 className="text-2xl font-bold text-gray-900">eBook Kütüphanesi</h1>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="font-medium">Çıkış Yap</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
                    {/* Welcome Section */}
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl font-bold text-gray-900">
                            Hoş Geldiniz, {user?.firstName || user?.username}!
                        </h2>
                        <p className="text-gray-600 text-lg">
                            eBook kütüphanesine başarıyla giriş yaptınız.
                        </p>
                    </div>

                    {/* User Info Card */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 space-y-3">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Kullanıcı Bilgileri</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Kullanıcı Adı</p>
                                <p className="text-base font-medium text-gray-900">{user?.username}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">E-posta</p>
                                <p className="text-base font-medium text-gray-900">{user?.email || 'Belirtilmemiş'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Ad Soyad</p>
                                <p className="text-base font-medium text-gray-900">
                                    {user?.firstName && user?.lastName
                                        ? `${user.firstName} ${user.lastName}`
                                        : 'Belirtilmemiş'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Roller</p>
                                <div className="flex gap-2 mt-1">
                                    {user?.roles?.map((role) => (
                                        <span
                                            key={role}
                                            className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full"
                                        >
                                            {role}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hızlı Erişim</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Link
                                to="/library"
                                className="flex items-center gap-4 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl hover:shadow-md transition-shadow group"
                            >
                                <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                                    <Library className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">Kütüphanem</h4>
                                    <p className="text-sm text-gray-600">Kitaplarınıza göz atın</p>
                                </div>
                            </Link>

                            <div className="flex items-center gap-4 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl opacity-50 cursor-not-allowed">
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <BookOpen className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">Keşfet</h4>
                                    <p className="text-sm text-gray-600">Yakında...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HomePage;
