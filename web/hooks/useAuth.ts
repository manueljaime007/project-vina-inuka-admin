import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/auth.service';

export function useAuth() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading, setAuth, setLoading, logout: clearStore } = useAuthStore();
    const [error, setError] = useState<string | null>(null);

    const login = async (email: string, password: string) => {
        try {
            setLoading(true);
            setError(null);

            const response = await authService.login(email, password);
            setAuth(response.admin);
            router.push('/dashboard');

            return { success: true };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erro ao fazer login';
            setError(message);
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        } finally {
            clearStore();
            router.push('/login');
        }
    };

    const verifyAuth = async () => {
        try {
            setLoading(true);
            const response = await authService.verify();

            if (response.valid && response.admin) {
                setAuth(response.admin);
                return true;
            }
            return false;
        } catch {
            clearStore();
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        logout,
        verifyAuth,
    };
}