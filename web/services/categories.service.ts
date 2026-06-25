import { api } from './api.service';

export interface Category {
    id: string;
    name: string;
    description?: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface CategoriesResponse {
    data: Category[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
    filters?: {
        search: string | null;
    };
    sort?: {
        sortBy: string;
        sortOrder: 'asc' | 'desc';
    };
}

export interface CreateCategoryData {
    name: string;
    description?: string;
}

export const categoriesService = {
    // Listar categorias
    list: (params?: { page?: number; limit?: number; search?: string }) => {
        const query = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    query.append(key, String(value));
                }
            });
        }
        const qs = query.toString();
        return api.get<CategoriesResponse>(`/product-categories${qs ? `?${qs}` : ''}`);
    },

    // Buscar categoria por ID
    get: (id: string) => {
        return api.get<Category>(`/product-categories/${id}`);
    },

    // Criar categoria
    create: (data: CreateCategoryData) => {
        return api.post<Category>('/product-categories', data);
    },

    // Atualizar categoria
    update: (id: string, data: CreateCategoryData) => {
        return api.patch<Category>(`/product-categories/${id}`, data);
    },

    // Eliminar categoria
    delete: (id: string) => {
        return api.delete(`/product-categories/${id}`);
    },
};