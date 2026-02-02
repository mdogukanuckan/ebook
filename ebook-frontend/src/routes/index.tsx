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
const AuthorManagementPage = lazy(() => import('../pages/admin/AuthorManagementPage'));
const CategoryManagementPage = lazy(() => import('../pages/admin/CategoryManagementPage'));
const BookDetailPage = lazy(() => import('../pages/books/BookDetailPage'));
const SubscriptionPage = lazy(() => import('../pages/subscription/SubscriptionPage'));
const SearchPage = lazy(() => import('../pages/search/SearchPage'));
const ReadBookPage = lazy(() => import('../pages/reading/ReadBookPage'));
const AdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboardPage'));
const UserManagementPage = lazy(() => import('../pages/admin/UserManagementPage'));
const PlanManagementPage = lazy(() => import('../pages/admin/PlanManagementPage'));
const AdminBookManagementPage = lazy(() => import('../pages/admin/AdminBookManagementPage'));
const EditBookPage = lazy(() => import('../pages/admin/EditBookPage'));
const FavoritesPage = lazy(() => import('../pages/favorites/FavoritesPage'));


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
                path: 'favorites',
                element: (
                    <LazyPage>
                        <PrivateRoute>
                            <FavoritesPage />
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
                path: 'admin/users',
                element: (
                    <LazyPage>
                        <PrivateRoute roles={['ROLE_ADMIN']}>
                            <UserManagementPage />
                        </PrivateRoute>
                    </LazyPage>
                ),
            },
            {
                path: 'admin/plans',
                element: (
                    <LazyPage>
                        <PrivateRoute roles={['ROLE_ADMIN']}>
                            <PlanManagementPage />
                        </PrivateRoute>
                    </LazyPage>
                ),
            },
            {
                path: 'admin/books',
                element: (
                    <LazyPage>
                        <PrivateRoute roles={['ROLE_ADMIN']}>
                            <AdminBookManagementPage />
                        </PrivateRoute>
                    </LazyPage>
                ),
            },
            {
                path: 'admin/books/edit/:id',
                element: (
                    <LazyPage>
                        <PrivateRoute roles={['ROLE_ADMIN']}>
                            <EditBookPage />
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
                path: 'admin/authors',
                element: (
                    <LazyPage>
                        <PrivateRoute roles={['ROLE_ADMIN']}>
                            <AuthorManagementPage />
                        </PrivateRoute>
                    </LazyPage>
                ),
            },
            {
                path: 'admin/categories',
                element: (
                    <LazyPage>
                        <PrivateRoute roles={['ROLE_ADMIN']}>
                            <CategoryManagementPage />
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
                path: 'read/:id',
                element: (
                    <LazyPage>
                        <PrivateRoute>
                            <ReadBookPage />
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