import { api } from './api.service';

export interface RequestProduct {
    id: string;
    name: string;
    quantity: number;
    price: number;
}

export interface ClientRequest {
    id: string;
    customer_name: string;
    customer_phone: string;
    products: RequestProduct[];
    total: number;
    status: 'pending' | 'completed' | 'cancelled';
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
}

export interface RequestsResponse {
    data: ClientRequest[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
    filters: {
        status: string | null;
        startDate: string | null;
        endDate: string | null;
    };
    sort: {
        sortBy: string;
        sortOrder: 'asc' | 'desc';
    };
}

export interface RequestQueryParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    status?: 'pending' | 'completed' | 'cancelled';
    startDate?: string;
    endDate?: string;
}

export const requestsService = {
    // Listar solicitações
    list: (params?: RequestQueryParams) => {
        const query = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    query.append(key, String(value));
                }
            });
        }
        const qs = query.toString();
        return api.get<RequestsResponse>(`/requests${qs ? `?${qs}` : ''}`);
    },

    // Buscar solicitação por ID
    get: (id: string) => {
        return api.get<ClientRequest>(`/requests/${id}`);
    },

    // Atualizar status da solicitação
    updateStatus: (id: string, status: 'pending' | 'completed' | 'cancelled') => {
        return api.patch<ClientRequest>(`/requests/${id}/status`, { status });
    },

    // Criar solicitação (pode ser útil para testes)
    create: (data: {
        customer_name: string;
        customer_phone: string;
        products: { id: string; name: string; quantity: number; price: number }[];
        total: number;
    }) => {
        return api.post<ClientRequest>('/requests', data);
    },

    // Eliminar solicitação (soft delete)
    delete: (id: string) => {
        return api.delete(`/requests/${id}`);
    },

    // 🆕 Eliminar múltiplas solicitações (permanentemente)
    deleteMany: (ids: string[]) => {
        return api.delete<{
            success: boolean;
            deletedCount: number;
            deletedIds: string[]
        }>('/requests/batch', {
            body: JSON.stringify({ ids }),
        });
    },

    // Restaurar solicitação
    restore: (id: string) => {
        return api.post(`/requests/${id}/restore`);
    },

    // Listar solicitações deletadas
    trash: () => {
        return api.get<ClientRequest[]>('/requests/deleted');
    },
};