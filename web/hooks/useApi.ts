import { useState, useCallback } from 'react';
import { useAuthStore } from '@/lib/store/authStore';

interface UseApiOptions {
    onSuccess?: (data: any) => void;
    onError?: (error: Error) => void;
    onFinally?: () => void;
}

export function useApi<T = any>() {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const execute = useCallback(async (
        apiCall: () => Promise<any>,
        options: UseApiOptions = {}
    ) => {
        try {
            setLoading(true);
            setError(null);

            const response = await apiCall();
            setData(response.data);
            options.onSuccess?.(response.data);
            return response;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Erro na requisição');
            setError(error);
            options.onError?.(error);

            // Se for 401, fazer logout
            if (error.message.includes('401')) {
                useAuthStore.getState().logout();
                window.location.href = '/login';
            }

            throw error;
        } finally {
            setLoading(false);
            options.onFinally?.();
        }
    }, []);

    return {
        data,
        loading,
        error,
        execute,
        setData,
        reset: () => {
            setData(null);
            setError(null);
            setLoading(false);
        },
    };
}