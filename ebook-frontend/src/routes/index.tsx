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
const BooksPage = lazy(() => import('../pages/books/BooksPage'));
const CreateBookPage = lazy(() => import('../pages/books/CreateBookPage'));
const CreateAuthorPage = lazy(() => import('../pages/authors/CreateAuthorPage'));
const CreateCategoryPage = lazy(() => import('../pages/categories/CreateCategoryPage'));
const BookDetailPage = lazy(() => import('../pages/books/BookDetailPage'));
const SubscriptionPage = lazy(() => import('../pages/subscription/SubscriptionPage'));
const SearchPage = lazy(() => import('../pages/search/SearchPage'));
const AdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboardPage'));


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
                path: 'search',
                element: (
                    <LazyPage>
                        <PrivateRoute>
                            <SearchPage />
                        </PrivateRoute>
                    </LazyPage>
                ),
            },
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
                path: 'books',
                element: (
                    <LazyPage>
                        <PrivateRoute>
                            <BooksPage />
                        </PrivateRoute>
                    </LazyPage>
                ),
            },
            {
                path: 'admin',
                element: (
                    <LazyPage>
                        <PrivateRoute roles={['ROLE_ADMIN']}>
                            <AdminDashboardPage />
                        </PrivateRoute>
                    </LazyPage>
                ),
            },
            {
                path: 'books/new',
                element: (
                    <LazyPage>
                        <PrivateRoute roles={['ROLE_ADMIN']}>
                            <CreateBookPage />
                        </PrivateRoute>
                    </LazyPage>
                ),
            },
            {
                path: 'authors/new',
                element: (
                    <LazyPage>
                        <PrivateRoute roles={['ROLE_ADMIN']}>
                            <CreateAuthorPage />
                        </PrivateRoute>
                    </LazyPage>
                ),
            },
            {
                path: 'categories/new',
                element: (
                    <LazyPage>
                        <PrivateRoute roles={['ROLE_ADMIN']}>
                            <CreateCategoryPage />
                        </PrivateRoute>
                    </LazyPage>
                ),
            },
            {
                path: 'books/:id',
                element: (
                    <LazyPage>
                        <PrivateRoute>
                            <BookDetailPage />
                        </PrivateRoute>
                    </LazyPage>
                ),
            },
            {
                path: 'subscription',
                element: (
                    <LazyPage>
                        <PrivateRoute>
                            <SubscriptionPage />
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