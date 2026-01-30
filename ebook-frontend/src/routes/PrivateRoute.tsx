import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoadingScreen } from '../components/common/LoadingScreen';
import type { ReactNode } from 'react';

interface PrivateRouteProps {
    children: ReactNode;
    roles?: string[];
}

export const PrivateRoute = ({ children, roles }: PrivateRouteProps) => {
    const { isAuthenticated, isLoading, user } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <LoadingScreen message="Yetkilendiriliyor..." />;
    }

    // If user is not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    // If roles are specified, check if user has required role
    if (roles && roles.length > 0) {
        const hasPermission = user?.roles.some(role => roles.includes(role));
        if (!hasPermission) {
            // User is authenticated but doesn't have permission
            return <Navigate to="/" replace />;
        }
    }

    return <>{children}</>;
};

export default PrivateRoute;
