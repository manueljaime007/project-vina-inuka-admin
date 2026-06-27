const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const api = {
    async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${API_URL}${endpoint}`;
        console.log('🔗 API Request URL:', url);
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (options.body instanceof FormData) {
            delete headers['Content-Type'];
        }

        const response = await fetch(url, {
            ...options,
            headers,
            credentials: 'include',
        });

        if (response.status === 401) {
            if (!endpoint.includes('/auth/')) {
                if (typeof window !== 'undefined') {
                    const { useAuthStore } = await import('@/store/authStore');
                    useAuthStore.getState().logout();
                    window.location.href = '/login';
                }
            }
            throw new Error('Não autorizado');
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.message || 'Erro na requisição');
        }

        return data;
    },

    get<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'GET' });
    },

    post<T>(endpoint: string, body?: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: body instanceof FormData ? body : JSON.stringify(body),
        });
    },

    put<T>(endpoint: string, body?: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: body instanceof FormData ? body : JSON.stringify(body),
        });
    },


    patch<T>(endpoint: string, body?: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PATCH',
            body: body instanceof FormData ? body : JSON.stringify(body),
        });
    },

    delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'DELETE',
            ...options,
            headers: {
                ...options?.headers,
                'Content-Type': 'application/json',
            },
        });
    },


};