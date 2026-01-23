import { Loader2 } from 'lucide-react';

interface LoadingScreenProps {
    message?: string;
}

export const LoadingScreen = ({ message = 'Yükleniyor...' }: LoadingScreenProps) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
            <Loader2 size={48} className="text-blue-600 animate-spin mb-4" />
            <p className="text-slate-600 font-medium animate-pulse text-sm uppercase tracking-wider">
                {message}
            </p>
        </div>
    );
};

export default LoadingScreen;
