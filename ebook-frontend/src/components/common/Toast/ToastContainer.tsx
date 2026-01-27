import { useAppSelector } from '../../../store/hooks';
import { Toast } from './Toast';

export const ToastContainer = () => {
    const toasts = useAppSelector((state) => state.ui.toasts);

    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-50 w-full max-w-sm flex flex-col pointer-events-none">
            <div className="pointer-events-auto">
                {toasts.map((toast) => (
                    <Toast key={toast.id} {...toast} />
                ))}
            </div>
        </div>
    );
};
