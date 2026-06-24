import { apiClient } from '../client';
import { API_CONFIG } from '@/shared/config/api.config';
import { Product } from '@/shared/types';

export interface CreateProductData {
  name: string;
  slug: string;
  categoryId: string;
  price: number;
  stock: number;
  status: 'ativo' | 'inativo';
  description: string;
  imageFile?: File;
}

export interface UpdateProductData extends Partial<CreateProductData> {}

export interface BatchActionResponse {
  success: boolean;
  message: string;
  updatedCount?: number;
  deletedCount?: number;
  restoredCount?: number;
  errors?: string[];
}

export const productsApi = {
  list: () => {
    return apiClient.get<Product[]>(API_CONFIG.endpoints.products.list);
  },

  get: (id: string) => {
    return apiClient.get<Product>(API_CONFIG.endpoints.products.get(id));
  },

  create: (data: CreateProductData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'imageFile' && value instanceof File) {
          formData.append('image', value);
        } else {
          formData.append(key, String(value));
        }
      }
    });
    return apiClient.post<Product>(API_CONFIG.endpoints.products.create, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  update: (id: string, data: UpdateProductData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'imageFile' && value instanceof File) {
          formData.append('image', value);
        } else {
          formData.append(key, String(value));
        }
      }
    });
    return apiClient.put<Product>(API_CONFIG.endpoints.products.update(id), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Soft delete - move para o lixo
   */
  softDelete: (id: string) => {
    return apiClient.delete(API_CONFIG.endpoints.products.softDelete(id));
  },

  /**
   * Delete permanente
   */
  delete: (id: string) => {
    return apiClient.delete(API_CONFIG.endpoints.products.delete(id));
  },

  /**
   * Restaurar do lixo
   */
  restore: (id: string) => {
    return apiClient.post(API_CONFIG.endpoints.products.restore(id));
  },

  /**
   * Listar produtos no lixo (deleted)
   */
  trash: () => {
    return apiClient.get<Product[]>(API_CONFIG.endpoints.products.trash);
  },

  /**
   * Soft delete em lote
   */
  softDeleteMany: (ids: string[]) => {
    return apiClient.post<BatchActionResponse>(
      API_CONFIG.endpoints.products.softDeleteMany,
      { ids }
    );
  },

  /**
   * Restaurar em lote
   */
  restoreMany: (ids: string[]) => {
    return apiClient.post<BatchActionResponse>(
      API_CONFIG.endpoints.products.restoreMany,
      { ids }
    );
  },

  /**
   * Delete permanente em lote
   */
  deleteMany: (ids: string[]) => {
    return apiClient.post<BatchActionResponse>(
      API_CONFIG.endpoints.products.deleteMany,
      { ids }
    );
  },
};