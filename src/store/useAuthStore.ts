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
    setHasHydrated: (hydrated: boolean) => void; // Ei function-ti add kora holo
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
            setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }), // Implement kora holo
        }),
        {
            name: 'auth-storage', 
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true); 
            },
        }
    )
);