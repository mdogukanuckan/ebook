
import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { config } from '../config/environment';

export const axiosInstance: AxiosInstance = axios.create({
    baseURL: config.apiBaseUrl,
    timeout: 15000, 
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        
        const token = localStorage.getItem('accessToken');

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (import.meta.env.DEV) {
            console.log('🚀 API Request:', {
                method: config.method?.toUpperCase(),
                url: config.url,
                data: config.data,
            });
        }

        return config;
    },
    (error: AxiosError) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        
        if (import.meta.env.DEV) {
            console.log('✅ API Response:', {
                status: response.status,
                url: response.config.url,
                data: response.data,
            });
        }

        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (import.meta.env.DEV) {
            console.error('❌ API Error:', {
                status: error.response?.status,
                url: error.config?.url,
                message: error.message,
                data: error.response?.data,
            });
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                
                const response = await axios.post(`${config.apiBaseUrl}/auth/refresh`, {}, {
                    withCredentials: true 
                });

                const { accessToken } = response.data;

                if (accessToken) {
                    localStorage.setItem('accessToken', accessToken);

                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    }
                    return axiosInstance(originalRequest);
                }
            } catch (refreshError) {
                console.error('Session expired:', refreshError);
                
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        if (error.response?.status === 403) {
            console.error('🚫 Access Denied: Insufficient permissions');
        }

        if (error.response?.status === 404) {
            console.error('🔍 Resource not found');
        }

        if (error.response?.status === 500) {
            console.error('🔥 Server Error: Please try again later');
        }

        if (!error.response) {
            console.error('🌐 Network Error: Please check your internet connection');
        }

        return Promise.reject(error);
    }
);

export const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        
        const message = error.response?.data?.message || error.response?.data?.error;
        if (message) return message;

        if (error.response?.statusText) return error.response.statusText;

        if (error.message) return error.message;
    }

    return 'An unexpected error occurred';
};

export default axiosInstance;
