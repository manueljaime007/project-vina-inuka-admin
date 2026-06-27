import { api } from './api.service';

export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    stock: number;
    category_id: string;
    image_url: string;
    active: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    categories?: {
        name: string;
    };
}

export interface ProductsResponse {
    data: Product[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
    filters: {
        category_id: string | null;
        minPrice: number | null;
        maxPrice: number | null;
        active: boolean | null;
        search: string | null;
    };
    sort: {
        sortBy: string;
        sortOrder: 'asc' | 'desc';
    };
}

export interface ProductQueryParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
    category_id?: string;
    minPrice?: number;
    maxPrice?: number;
    active?: boolean;
}

export const productsService = {
    list: (params?: ProductQueryParams) => {
        const query = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    query.append(key, String(value));
                }
            });
        }
        const qs = query.toString();
        return api.get<ProductsResponse>(`/products${qs ? `?${qs}` : ''}`);
    },

    // 🔑 Buscar por ID (agora que o backend tem GET /products/:id)
    getById: (id: string) => {
        console.log('🔍 productsService.getById - ID:', id);
        return api.get<Product>(`/products/${id}`);
    },

  
    create: (data: FormData) => {
        const normalized = new FormData();

        for (const [key, value] of data.entries()) {
            let newKey = key;
            if (key === 'imageFile') newKey = 'image';
            normalized.append(newKey, value);
        }

        return api.post<Product>('/products', normalized);
    },

    update: (id: string, data: FormData) => {
        const normalized = new FormData();
        for (const [key, value] of data.entries()) {
            let newKey = key;
            if (key === 'categoryId') newKey = 'category_id';
            if (key === 'status') newKey = 'active';
            if (key === 'imageFile') newKey = 'image';
            normalized.append(newKey, value);
        }
        return api.patch<Product>(`/products/${id}`, normalized);
    },

    delete: (id: string) => {
        return api.delete(`/products/${id}`);
    },

    deletePermanent: (id: string) => {
        return api.delete(`/products/${id}/permanent`);
    },

    restore: (id: string) => {
        return api.patch(`/products/${id}/restore`);
    },

    trash: () => {
        return api.get<Product[]>('/products/deleted');
    },

    deleteMany: (ids: string[]) => {
        return api.delete<{ success: boolean; deletedCount: number; deletedIds: string[] }>('/products/batch', {
            body: JSON.stringify({ ids }),
        });
    },

    restoreMany: (ids: string[]) => {
        console.log('📦 restoreMany - IDs:', ids);
        return api.put<{ success: boolean; restoredCount: number; restoredIds: string[] }>(
            '/products/batch/restore',
            { ids } // ← Envia como objeto, não como string
        );
    },

    deleteManyPermanent: (ids: string[]) => {
        return api.delete<{ success: boolean; deletedCount: number; deletedIds: string[] }>('/products/batch/permanent', {
            body: JSON.stringify({ ids }),
        });
    },
};