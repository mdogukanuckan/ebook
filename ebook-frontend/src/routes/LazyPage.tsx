import { Suspense } from 'react';
import { LoadingScreen } from '../components/common/LoadingScreen';

export const LazyPage = ({ children }: { children: React.ReactNode }) => (
    <Suspense fallback={<LoadingScreen />}>{children}</Suspense>
);
