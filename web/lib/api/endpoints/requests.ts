import { apiClient } from '../client';
import { API_CONFIG } from '@/shared/config/api.config';
import { ClientRequest } from '@/shared/types';

export interface UpdateRequestData {
    status: 'pendente' | 'em_processamento' | 'concluida' | 'cancelada';
}

export const requestsApi = {
    list: () => {
        return apiClient.get<ClientRequest[]>(API_CONFIG.endpoints.requests.list);
    },

    get: (id: string) => {
        return apiClient.get<ClientRequest>(API_CONFIG.endpoints.requests.get(id));
    },

    update: (id: string, data: UpdateRequestData) => {
        return apiClient.patch<ClientRequest>(API_CONFIG.endpoints.requests.update(id), data);
    },
};