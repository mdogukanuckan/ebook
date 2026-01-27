import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useAppDispatch } from '../../../store/hooks';
import { removeToast } from '../../../store/slices/uiSlice';

interface ToastProps {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
}

const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
};

const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
};

export const Toast = ({ id, message, type, duration = 3000 }: ToastProps) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(removeToast(id));
        }, duration);

        return () => clearTimeout(timer);
    }, [id, duration, dispatch]);

    return (
        <div className={`flex items-center p-4 mb-3 rounded-lg border shadow-sm transition-all duration-300 transform translate-x-0 ${styles[type]}`}>
            <div className="flex-shrink-0 mr-3">
                {icons[type]}
            </div>
            <div className="flex-1 text-sm font-medium">
                {message}
            </div>
            <button
                onClick={() => dispatch(removeToast(id))}
                className="ml-3 inline-flex flex-shrink-0 justify-center items-center h-5 w-5 rounded-md text-gray-400 hover:text-gray-600 focus:outline-none"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};
