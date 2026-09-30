import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'ADMIN' | 'TECHNICIAN' | 'CUSTOMER';

interface User {
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
}

interface AuthState {
    isLoggedIn: boolean;
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isLoggedIn: true, // Demo-r jonno true rakha hoyeche
            user: {
                name: "System Admin",
                email: "admin@example.com",
                role: "ADMIN",
                avatar: "AD",
            },
            login: (userData) => set({ isLoggedIn: true, user: userData }),
            logout: () => set({ isLoggedIn: false, user: null }),
        }),
        {
            name: 'auth-storage',
        }
    )
);