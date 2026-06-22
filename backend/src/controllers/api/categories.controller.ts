import { Request, Response } from 'express';
import { supabase } from '../../config/supabase';

// GET todas as categorias (público)
export const getCategorias = async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase.from('categorias_produtos').select('*');

        if (error) throw error;

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar categorias' });
    }
};

// POST criar categoria (admin)
export const createCategoria = async (req: Request, res: Response) => {
    try {
        const { nome, descricao } = req.body;

        const { data, error } = await supabase
            .from('categorias_produtos')
            .insert([{ nome, descricao }])
            .select();

        if (error) throw error;

        res.status(201).json(data[0]);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar categoria' });
    }
};

// PUT atualizar categoria (admin)
export const updateCategoria = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { nome, descricao } = req.body;

        const { data, error } = await supabase
            .from('categorias_produtos')
            .update({ nome, descricao })
            .eq('id', id)
            .select();

        if (error) throw error;

        res.json(data[0]);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar categoria' });
    }
};

// DELETE categoria (admin)
export const deleteCategoria = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const { error } = await supabase.from('categorias_produtos').delete().eq('id', id);

        if (error) throw error;

        res.json({ message: 'Categoria deletada com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar categoria' });
    }
};