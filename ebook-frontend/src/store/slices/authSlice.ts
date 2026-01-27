import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../types/auth';
import { getCurrentUser } from '../../features/auth/services/authApi';

interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

// Initial state reading ONLY token from localStorage
const initialState: AuthState = {
    user: null,
    accessToken: localStorage.getItem('accessToken'),
    isAuthenticated: !!localStorage.getItem('accessToken'),
    status: 'idle',
};

// Async thunk to fetch current user profile
export const getUserProfile = createAsyncThunk(
    'auth/getUserProfile',
    async () => {
        const response = await getCurrentUser();
        return response;
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ user: User; accessToken: string }>
        ) => {
            const { user, accessToken } = action.payload;
            state.user = user;
            state.accessToken = accessToken;
            state.isAuthenticated = true;

            // Only store token, NOT user details
            localStorage.setItem('accessToken', accessToken);
        },
        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false;
            state.status = 'idle';

            // Clear localStorage
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user'); // Clean up old data if exists
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserProfile.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getUserProfile.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // @ts-ignore - The API response structure might match User or wrap it. Assuming direct mapping for now.
                // If API returns { data: user }, adjust accordingly.
                state.user = action.payload as unknown as User;
                state.isAuthenticated = true;
            })
            .addCase(getUserProfile.rejected, (state) => {
                state.status = 'failed';
                state.isAuthenticated = false;
                state.accessToken = null;
                state.user = null;
                localStorage.removeItem('accessToken');
            });
    }
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
