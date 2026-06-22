import { Request, Response } from 'express';
import { supabase } from '@/config/supabase';

export const getCategories = async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name', { ascending: true });

        if (error) throw error;

        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar categorias' });
    }
};

export const getCategoryById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(404).json({ error: 'Categoria não encontrada' });
    }
};

export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Nome é obrigatório' });
        }

        const { data, error } = await supabase
            .from('categories')
            .insert([{ name, description }])
            .select();

        if (error) {
            if (error.code === '23505') {
                return res.status(400).json({ error: 'Categoria já existe' });
            }
            throw error;
        }

        res.status(201).json(data[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar categoria' });
    }
};

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Nome é obrigatório' });
        }

        const { data: existingCategory, error: checkError } = await supabase
            .from('categories')
            .select('id')
            .eq('id', id)
            .single();

        if (checkError || !existingCategory) {
            return res.status(404).json({ error: 'Categoria não encontrada' });
        }

        const { data, error } = await supabase
            .from('categories')
            .update({
                name,
                description,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select();

        if (error) {
            if (error.code === '23505') {
                return res.status(400).json({ error: 'Categoria já existe' });
            }
            throw error;
        }

        res.json(data[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar categoria' });
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const { data: products, error: productsError } = await supabase
            .from('products')
            .select('id')
            .eq('category_id', id)
            .is('deleted_at', null);

        if (productsError) throw productsError;

        if (products && products.length > 0) {
            return res.status(400).json({
                error: 'Não é possível deletar categoria com produtos associados'
            });
        }

        const { data: existingCategory, error: checkError } = await supabase
            .from('categories')
            .select('id')
            .eq('id', id)
            .single();

        if (checkError || !existingCategory) {
            return res.status(404).json({ error: 'Categoria não encontrada' });
        }

        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.json({ message: 'Categoria deletada com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao deletar categoria' });
    }
};