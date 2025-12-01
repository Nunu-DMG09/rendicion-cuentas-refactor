import type { User } from '@/core/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware/devtools';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    setUser: (user: User) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState> ()(
    devtools((set) => ({
        user: null,
        isAuthenticated: false,
        setUser: (user: User) => set(() => ({
            user,
            isAuthenticated: true,
        })),
        clearAuth: () => set(() => ({
            user: null,
            isAuthenticated: false,
        })),
    }))
)