import { apiClient } from '../client';
import { API_CONFIG } from '@/shared/config/api.config';
import { Category } from '@/shared/types';

export interface CreateCategoryData {
    name: string;
}

export interface UpdateCategoryData {
    name: string;
}

export const categoriesApi = {
    list: () => {
        return apiClient.get<Category[]>(API_CONFIG.endpoints.categories.list);
    },

    get: (id: string) => {
        return apiClient.get<Category>(API_CONFIG.endpoints.categories.get(id));
    },

    create: (data: CreateCategoryData) => {
        return apiClient.post<Category>(API_CONFIG.endpoints.categories.create, data);
    },

    update: (id: string, data: UpdateCategoryData) => {
        return apiClient.put<Category>(API_CONFIG.endpoints.categories.update(id), data);
    },

    delete: (id: string) => {
        return apiClient.delete(API_CONFIG.endpoints.categories.delete(id));
    },
};