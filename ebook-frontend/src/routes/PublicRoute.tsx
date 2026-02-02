import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoadingScreen } from '../components/common/LoadingScreen';
import type { ReactNode } from 'react';

interface PublicRouteProps {
    children: ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <LoadingScreen message="Kontrol ediliyor..." />;
    }

    return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>;
};

export default PublicRoute;
