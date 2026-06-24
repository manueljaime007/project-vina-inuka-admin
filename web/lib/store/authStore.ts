import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Admin {
    id: string;
    email: string;
    name: string;
    avatar_url?: string | null;
}

interface AuthState {
    user: Admin | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setAuth: (user: Admin) => void;
    setUser: (user: Admin) => void;
    setLoading: (loading: boolean) => void;
    logout: () => void;
    clearUser: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            setAuth: (user) => {
                set({ user, isAuthenticated: true });
            },
            setUser: (user) => {
                set({ user });
            },
            setLoading: (isLoading) => {
                set({ isLoading });
            },
            logout: () => {
                set({ user: null, isAuthenticated: false });
            },
            clearUser: () => {
                set({ user: null, isAuthenticated: false });
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);