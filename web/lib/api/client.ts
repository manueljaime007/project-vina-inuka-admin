import { API_CONFIG } from '@/shared/config/api.config';
import { useAuthStore } from '@/lib/store/authStore';

interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}

class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = API_CONFIG.baseURL;
    this.timeout = API_CONFIG.timeout;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const headers: HeadersInit = {
      ...API_CONFIG.headers,
      ...options.headers,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
        credentials: 'include',
      });

      clearTimeout(timeoutId);

      // Tentar parsear o JSON, mas se falhar, usar texto
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { error: text || 'Erro na requisição' };
      }

      if (!response.ok) {
        // Se for 401 e NÃO for uma requisição de login, fazer logout
        if (response.status === 401 && !endpoint.includes('/auth/login')) {
          useAuthStore.getState().logout();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        throw new Error(data.error || data.message || 'Erro na requisição');
      }

      return {
        data: data.data || data,
        message: data.message,
        status: response.status,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Tempo limite da requisição excedido');
      }
      throw error;
    }
  }

  get<T>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T>(endpoint: string, body?: any, options?: RequestInit) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    }).catch((error) => {
      // Se for logout, não propagar o erro para não quebrar o fluxo
      if (endpoint.includes('/auth/logout')) {
        console.warn('⚠️ Erro no logout, continuando...');
        return { data: { success: true } } as ApiResponse<T>;
      }
      throw error;
    });
  }

  put<T>(endpoint: string, body?: any, options?: RequestInit) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  patch<T>(endpoint: string, body?: any, options?: RequestInit) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  delete<T>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();