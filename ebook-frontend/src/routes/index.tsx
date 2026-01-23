import { createBrowserRouter } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import { PublicRoute } from './PublicRoute';
import { lazy, Suspense } from 'react';
import { LoadingScreen } from '../components/common/LoadingScreen';
import MainLayout from '../layouts/MainLayout';

// Lazy loading for pages
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const HomePage = lazy(() => import('../pages/HomePage'));
const LibraryPage = lazy(() => import('../pages/library/LibraryPage'));
const ProfilePage = lazy(() => import('../pages/profile/ProfilePage'));
const SettingsPage = lazy(() => import('../pages/settings/SettingsPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

// Wrapper component for lazy-loaded pages
const LazyPage = ({ children }: { children: React.ReactNode }) => (
    <Suspense fallback={<LoadingScreen />}>{children}</Suspense>
);

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                path: 'login',
                element: (
                    <LazyPage>
                        <PublicRoute>
                            <LoginPage />
                        </PublicRoute>
                    </LazyPage>
                ),
            },
            {
                path: 'register',
                element: (
                    <LazyPage>
                        <PublicRoute>
                            <RegisterPage />
                        </PublicRoute>
                    </LazyPage>
                ),
            },
            {
                index: true,
                element: (
                    <LazyPage>
                        <PrivateRoute>
                            <HomePage />
                        </PrivateRoute>
                    </LazyPage>
                ),
            },
            {
                path: 'library',
                element: (
                    <LazyPage>
                        <PrivateRoute>
                            <LibraryPage />
                        </PrivateRoute>
                    </LazyPage>
                ),
            },
            {
                path: 'profile',
                element: (
                    <LazyPage>
                        <PrivateRoute>
                            <ProfilePage />
                        </PrivateRoute>
                    </LazyPage>
                ),
            },
            {
                path: 'settings',
                element: (
                    <LazyPage>
                        <PrivateRoute>
                            <SettingsPage />
                        </PrivateRoute>
                    </LazyPage>
                ),
            },
            {
                path: '*',
                element: (
                    <LazyPage>
                        <NotFoundPage />
                    </LazyPage>
                ),
            },
        ],
    },
]);