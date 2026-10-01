import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'ADMIN' | 'TECHNICIAN' | 'CUSTOMER';

interface User {
    id?: string; 
    name: string;
    email: string;
    phone?: string;
    role: UserRole;
    avatar?: string;
    profileImage?: string;
}

interface AuthState {
    isLoggedIn: boolean;
    user: User | null;
    token: string | null;
    hasHydrated: boolean;
    login: (userData: User, token: string | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isLoggedIn: false,
            user: null,
            token: null,
            hasHydrated: false,
            login: (userData, token) => set({ isLoggedIn: true, user: userData, token }),
            logout: () => set({ isLoggedIn: false, user: null, token: null }),
        }),
        {
            name: 'auth-storage', 
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true); 
            },
        }
    )
);