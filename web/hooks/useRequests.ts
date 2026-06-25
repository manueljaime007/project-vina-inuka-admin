import { useState, useEffect, useCallback } from 'react';
import { requestsService, ClientRequest, RequestsResponse, RequestQueryParams } from '@/services/requests.service';

export function useRequests(initialParams?: RequestQueryParams) {
    const [requests, setRequests] = useState<ClientRequest[]>([]);
    const [meta, setMeta] = useState<RequestsResponse['meta'] | null>(null);
    const [filters, setFilters] = useState<RequestsResponse['filters'] | null>(null);
    const [sort, setSort] = useState<RequestsResponse['sort'] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [params, setParams] = useState<RequestQueryParams>(initialParams || { page: 1, limit: 10 });

    const fetchRequests = useCallback(async (queryParams?: RequestQueryParams) => {
        try {
            setLoading(true);
            setError(null);
            const response = await requestsService.list(queryParams || params);
            setRequests(response.data || []);
            setMeta(response.meta);
            setFilters(response.filters);
            setSort(response.sort);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar solicitações');
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => {
        fetchRequests();
    }, [params]);

    const updateStatus = useCallback(async (id: string, status: 'pending' | 'completed' | 'cancelled') => {
        try {
            const response = await requestsService.updateStatus(id, status);
            setRequests(prev => prev.map(r => r.id === id ? response : r));
            return { success: true, data: response };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erro ao atualizar status';
            setError(message);
            return { success: false, error: message };
        }
    }, []);

    const deleteRequest = useCallback(async (id: string) => {
        try {
            await requestsService.delete(id);
            setRequests(prev => prev.filter(r => r.id !== id));
            return { success: true };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erro ao eliminar solicitação';
            setError(message);
            return { success: false, error: message };
        }
    }, []);

    const deleteManyRequests = useCallback(async (ids: string[]) => {
        try {
            const response = await requestsService.deleteMany(ids);
            setRequests(prev => prev.filter(r => !ids.includes(r.id)));
            return { success: true, data: response };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erro ao eliminar solicitações';
            setError(message);
            return { success: false, error: message };
        }
    }, []);

    const restoreRequest = useCallback(async (id: string) => {
        try {
            await requestsService.restore(id);
            setRequests(prev => prev.filter(r => r.id !== id));
            return { success: true };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erro ao restaurar solicitação';
            setError(message);
            return { success: false, error: message };
        }
    }, []);

    // 🆕 Função para setar a busca
    const setSearch = useCallback((search: string) => {
        setParams(prev => ({ ...prev, search: search || undefined, page: 1 }));
    }, []);

    return {
        requests,
        meta,
        filters,
        sort,
        loading,
        error,
        params,
        setParams,
        refetch: fetchRequests,
        updateStatus,
        delete: deleteRequest,
        deleteMany: deleteManyRequests,
        restore: restoreRequest,
        goToPage: (page: number) => setParams(p => ({ ...p, page })),
        setStatusFilter: (status: 'pending' | 'completed' | 'cancelled' | null) =>
            setParams(p => ({ ...p, status: status || undefined, page: 1 })),
        setDateRange: (startDate?: string, endDate?: string) =>
            setParams(p => ({ ...p, startDate, endDate, page: 1 })),
        setSort: (sortBy: string, sortOrder: 'asc' | 'desc') =>
            setParams(p => ({ ...p, sortBy, sortOrder, page: 1 })),
        setSearch, // 🆕 Exportar setSearch
    };
}