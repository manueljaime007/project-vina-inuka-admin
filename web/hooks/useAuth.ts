import { useAuthStore } from '@/lib/store/authStore';
import { authApi } from '@/lib/api/endpoints/auth';
import { LoginFormData } from '@/lib/validations/auth';
import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function useAuth() {
    const router = useRouter();
    const pathname = usePathname();
    const { setAuth, setLoading, isLoading, isAuthenticated, user, logout: clearStore } = useAuthStore();
    const [error, setError] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const initRef = useRef(false);

    const login = async (data: LoginFormData) => {
        try {
            setLoading(true);
            setError(null);

            const response = await authApi.login(data);

            setAuth(response.data.admin);
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
            setLoading(true);

            // Tentar fazer logout no backend
            try {
                await authApi.logout();
            } catch (logoutError) {
                console.warn('Erro no logout do backend, limpando localmente:', logoutError);
            }

            // Limpar store
            clearStore();

            // Redirecionar para login
            router.push('/login');

        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            // Mesmo com erro, garantir que o usuário seja deslogado
            clearStore();
            router.push('/login');
        } finally {
            setLoading(false);
        }
    };

    const verifyAuth = async () => {
        try {
            setLoading(true);
            const response = await authApi.verify();

            if (response.data.valid && response.data.admin) {
                setAuth(response.data.admin);
                return true;
            } else {
                clearStore();
                return false;
            }
        } catch (error) {
            clearStore();
            return false;
        } finally {
            setLoading(false);
            setIsInitialized(true);
        }
    };

    // Verificar autenticação apenas uma vez na montagem
    useEffect(() => {
        if (pathname === '/login') {
            setIsInitialized(true);
            return;
        }

        if (!initRef.current) {
            initRef.current = true;
            if (!isAuthenticated && !user) {
                verifyAuth();
            } else {
                setIsInitialized(true);
            }
        }
    }, [pathname]);

    return {
        login,
        logout,
        verifyAuth,
        isLoading,
        isAuthenticated,
        user,
        error,
        isInitialized,
    };
}