import { useState, useEffect, useCallback } from 'react';
import { categoriesService, Category } from '@/services/categories.service';

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Buscar categorias
    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await categoriesService.list({ limit: 100 });
            setCategories(response.data || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar categorias');
        } finally {
            setLoading(false);
        }
    }, []);

    // Carregar ao montar
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // Criar categoria
    const createCategory = useCallback(async (name: string, description?: string) => {
        try {
            const response = await categoriesService.create({ name, description });
            setCategories(prev => [...prev, response]);
            return { success: true, data: response };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erro ao criar categoria';
            setError(message);
            return { success: false, error: message };
        }
    }, []);

    // Atualizar categoria
    const updateCategory = useCallback(async (id: string, name: string, description?: string) => {
        try {
            const response = await categoriesService.update(id, { name, description });
            setCategories(prev => prev.map(c => c.id === id ? response : c));
            return { success: true, data: response };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erro ao atualizar categoria';
            setError(message);
            return { success: false, error: message };
        }
    }, []);

    // Eliminar categoria
    const deleteCategory = useCallback(async (id: string) => {
        try {
            await categoriesService.delete(id);
            setCategories(prev => prev.filter(c => c.id !== id));
            return { success: true };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erro ao eliminar categoria';
            setError(message);
            return { success: false, error: message };
        }
    }, []);

    return {
        categories,
        loading,
        error,
        refetch: fetchCategories,
        createCategory,
        updateCategory,
        deleteCategory,
    };
}