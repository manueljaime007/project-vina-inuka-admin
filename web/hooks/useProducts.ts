import { useState, useEffect, useCallback } from 'react';
import { productsService, Product as ApiProduct, ProductsResponse, ProductQueryParams } from '@/services/products.service';
import { Product } from '@/shared/types';

// Mapear Product da API para o Product do frontend
function mapApiProductToProduct(apiProduct: ApiProduct): Product {
    return {
        id: apiProduct.id,
        name: apiProduct.name,
        slug: apiProduct.slug,
        brand: 'Vina', // ou 'INUKA' - ajustar conforme lógica
        categoryId: apiProduct.category_id,
        categoryName: apiProduct.categories?.name || 'Sem categoria',
        price: apiProduct.price,
        stock: apiProduct.stock,
        status: apiProduct.active ? 'ativo' : 'inativo',
        description: apiProduct.description || '',
        imageUrl: apiProduct.image_url,
        createdAt: apiProduct.created_at,
        deletedAt: apiProduct.deleted_at,
    };
}

export function useProducts(initialParams?: ProductQueryParams) {
    const [products, setProducts] = useState<Product[]>([]);
    const [meta, setMeta] = useState<ProductsResponse['meta'] | null>(null);
    const [filters, setFilters] = useState<ProductsResponse['filters'] | null>(null);
    const [sort, setSort] = useState<ProductsResponse['sort'] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [params, setParams] = useState<ProductQueryParams>(initialParams || { page: 1, limit: 10 });

    const fetchProducts = useCallback(async (queryParams?: ProductQueryParams) => {
        try {
            setLoading(true);
            setError(null);
            const response = await productsService.list(queryParams || params);
            setProducts(response.data?.map(mapApiProductToProduct) || []);
            setMeta(response.meta);
            setFilters(response.filters);
            setSort(response.sort);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar produtos');
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => {
        fetchProducts();
    }, [params]);

    // const getProductBySlug = useCallback(async (slug: string) => {
    //     try {
    //         setLoading(true);
    //         const response = await productsService.getBySlug(slug);
    //         return { success: true, data: mapApiProductToProduct(response) };
    //     } catch (err) {
    //         const message = err instanceof Error ? err.message : 'Erro ao buscar produto';
    //         setError(message);
    //         return { success: false, error: message };
    //     } finally {
    //         setLoading(false);
    //     }
    // }, []);

    const getProductById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            const response = await productsService.getById(id);
            return { success: true, data: mapApiProductToProduct(response) };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erro ao buscar produto';
            setError(message);
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    }, []);


    const createProduct = useCallback(async (data: FormData) => {
        try {
            const response = await productsService.create(data);
            const mapped = mapApiProductToProduct(response);
            setProducts(prev => [mapped, ...prev]);
            return { success: true, data: mapped };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erro ao criar produto';
            setError(message);
            return { success: false, error: message };
        }
    }, []);

    const updateProduct = useCallback(async (id: string, data: FormData) => {
        try {
            const response = await productsService.update(id, data);
            const mapped = mapApiProductToProduct(response);
            setProducts(prev => prev.map(p => p.id === id ? mapped : p));
            return { success: true, data: mapped };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erro ao atualizar produto';
            setError(message);
            return { success: false, error: message };
        }
    }, []);

    const deleteProduct = useCallback(async (id: string) => {
        try {
            await productsService.delete(id);
            setProducts(prev => prev.filter(p => p.id !== id));
            return { success: true };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erro ao eliminar produto';
            setError(message);
            return { success: false, error: message };
        }
    }, []);

    const deleteProductPermanent = useCallback(async (id: string) => {
        try {
            await productsService.deletePermanent(id);
            setProducts(prev => prev.filter(p => p.id !== id));
            return { success: true };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erro ao eliminar produto permanentemente';
            setError(message);
            return { success: false, error: message };
        }
    }, []);

    const restoreProduct = useCallback(async (id: string) => {
        try {
            await productsService.restore(id);
            setProducts(prev => prev.filter(p => p.id !== id));
            return { success: true };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erro ao restaurar produto';
            setError(message);
            return { success: false, error: message };
        }
    }, []);

    const deleteMany = useCallback(async (ids: string[]) => {
        try {
            const response = await productsService.deleteMany(ids);
            setProducts(prev => prev.filter(p => !ids.includes(p.id)));
            return { success: true, data: response };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erro ao eliminar produtos';
            setError(message);
            return { success: false, error: message };
        }
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
        meta,
        filters,
        sort,
        loading,
        error,
        params,
        setParams,
        refetch: fetchProducts,
        getProductById,
        createProduct,
        updateProduct,
        delete: deleteProduct,
        deletePermanent: deleteProductPermanent,
        restore: restoreProduct,
        deleteMany,
        restoreMany,
        deleteManyPermanent,
        goToPage: (page: number) => setParams(p => ({ ...p, page })),
        setSearch: (search: string) => setParams(p => ({ ...p, search: search || undefined, page: 1 })),
        setCategory: (category_id: string | null) => setParams(p => ({ ...p, category_id: category_id || undefined, page: 1 })),
        setPriceRange: (minPrice?: number, maxPrice?: number) => setParams(p => ({ ...p, minPrice, maxPrice, page: 1 })),
        setSort: (sortBy: string, sortOrder: 'asc' | 'desc') => setParams(p => ({ ...p, sortBy, sortOrder, page: 1 })),
    };
}