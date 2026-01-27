import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout as logoutAction, setCredentials } from '../store/slices/authSlice';
import { useCallback } from 'react';
import type { AuthResponse } from '../features/auth/types/auth';
import type { User } from '../types/auth';

export const useAuth = () => {
    const dispatch = useAppDispatch();
    const { user, isAuthenticated, status, accessToken } = useAppSelector((state) => state.auth);

    const login = useCallback((authResponse: AuthResponse) => {
        dispatch(setCredentials({
            user: {
                id: authResponse.userId,
                username: authResponse.username,
                email: authResponse.email,
                firstName: authResponse.firstName,
                lastName: authResponse.lastName,
                roles: authResponse.roles,
            },
            accessToken: authResponse.accessToken,
        }));
    }, [dispatch]);

    const logout = useCallback(() => {
        dispatch(logoutAction());
    }, [dispatch]);

    const updateUser = useCallback((updatedUser: User) => {
        if (accessToken) {
            dispatch(setCredentials({
                user: updatedUser,
                accessToken: accessToken
            }));
        }
    }, [dispatch, accessToken]);

    return {
        user,
        isAuthenticated,
        isLoading: status === 'loading',
        login,
        logout,
        updateUser,
    };
};
