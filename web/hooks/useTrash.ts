import { useState, useEffect, useCallback } from 'react';
import { productsService, Product as ApiProduct } from '@/services/products.service';
import { Product } from '@/shared/types';
import { mapApiProductToProduct } from '@/shared/mappers/product.mapper';

export function useTrash() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTrash = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await productsService.trash();
            setProducts(response.map(mapApiProductToProduct));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar produtos no lixo');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTrash();
    }, []);

    const restoreMany = useCallback(async (ids: string[]) => {
        try {
            const response = await productsService.restoreMany(ids);
            setProducts(prev => prev.filter(p => !ids.includes(p.id)));
            return { success: true, data: response };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erro ao restaurar produtos';
            setError(message);
            return { success: false, error: message };
        }
    }, []);

    const deleteManyPermanent = useCallback(async (ids: string[]) => {
        try {
            const response = await productsService.deleteManyPermanent(ids);
            setProducts(prev => prev.filter(p => !ids.includes(p.id)));
            return { success: true, data: response };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erro ao eliminar produtos permanentemente';
            setError(message);
            return { success: false, error: message };
        }
    }, []);

    return {
        products,
        loading,
        error,
        refetch: fetchTrash,
        restoreMany,
        deleteManyPermanent,
    };
}