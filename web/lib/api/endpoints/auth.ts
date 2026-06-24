import { apiClient } from '../client';
import { API_CONFIG } from '@/shared/config/api.config';
import { Admin } from '@/lib/store/authStore';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    admin: Admin;
}

export interface VerifyResponse {
    valid: boolean;
    admin: Admin | null;
}

export const authApi = {
    login: (credentials: LoginCredentials) => {
        return apiClient.post<LoginResponse>(
            API_CONFIG.endpoints.auth.login,
            credentials
        );
    },

    logout: () => {
        return apiClient.post(API_CONFIG.endpoints.auth.logout).catch((error) => {
            console.warn('Erro no logout via route handler, tentando direto...');
            // Fallback: tentar chamar diretamente o backend
            return fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api'}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            }).then(() => ({ data: { success: true } }));
        });
    },

    verify: () => {
        return apiClient.get<VerifyResponse>(
            API_CONFIG.endpoints.auth.verify
        );
    },
};