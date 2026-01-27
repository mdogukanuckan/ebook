import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
// import bookReducer from './slices/bookSlice'; // Will be implemented later

export const store = configureStore({
    reducer: {
        auth: authReducer,
        ui: uiReducer,
        // books: bookReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Optional: Disable serializable check if needed for non-serializable data in state
        }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
