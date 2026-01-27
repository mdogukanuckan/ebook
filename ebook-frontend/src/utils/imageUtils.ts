import { config } from '../config/environment';

export const getCoverImageUrl = (path?: string) => {
    if (!path) return undefined;
    if (path.startsWith('http') || path.startsWith('https') || path.startsWith('data:')) {
        return path;
    }
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;

    return `${config.apiBaseUrl}/books/${cleanPath}`;
};
