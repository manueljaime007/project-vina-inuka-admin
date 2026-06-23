import { Request, Response } from 'express';
import { supabase } from '@/config/supabase';


export const getCategories = async (req: Request, res: Response) => {
    try {
        const {
            page = 1,
            limit = 10,
            sortBy = 'name',
            sortOrder = 'asc',
            search = ''
        } = req.query;

        const pageNum = Math.max(1, parseInt(page as string) || 1);
        const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 10));
        const offset = (pageNum - 1) * limitNum;

        let query = supabase
            .from('categories')
            .select('*', { count: 'exact' });

        if (search) {
            query = query.ilike('name', `%${search}%`);
        }

        const validSortFields = ['name', 'created_at', 'updated_at'];
        const sortField = validSortFields.includes(sortBy as string) ? sortBy : 'name';
        const sortDir = sortOrder === 'asc' ? 'asc' : 'desc';
        query = query.order(sortField as string, { ascending: sortDir === 'asc' });

        query = query.range(offset, offset + limitNum - 1);

        const { data, error, count } = await query;

        if (error) throw error;

        const total = count || 0;
        const totalPages = Math.ceil(total / limitNum);

        res.json({
            data: data || [],
            meta: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages,
                hasNext: pageNum < totalPages,
                hasPrev: pageNum > 1
            },
            filters: {
                search: search || null
            },
            sort: {
                sortBy: sortField,
                sortOrder: sortDir
            }
        });
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

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: 'Dados da requisição são obrigatórios' });
        }

        const { data: existingCategory, error: checkError } = await supabase
            .from('categories')
            .select('*')
            .eq('id', id)
            .single();

        if (checkError || !existingCategory) {
            return res.status(404).json({ error: 'Categoria não encontrada' });
        }

        let updateData: any = {
            updated_at: new Date().toISOString()
        };

        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;

        const { data, error } = await supabase
            .from('categories')
            .update(updateData)
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