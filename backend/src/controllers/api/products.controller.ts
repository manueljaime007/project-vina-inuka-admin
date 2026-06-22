import { Request, Response } from 'express';
import { supabase } from '../../config/supabase';
import { uploadToCloudinary } from '../../utils/cloudinary-upload';
import { Produto } from '../../types';

// GET todos os produtos (público)
export const getProdutos = async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('produtos')
            .select('*, categorias_produtos(nome)')
            .eq('ativo', true);

        if (error) throw error;

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
};

// GET um produto específico (público)
export const getProdutoById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('produtos')
            .select('*, categorias_produtos(nome)')
            .eq('id', id)
            .single();

        if (error) throw error;

        res.json(data);
    } catch (error) {
        res.status(404).json({ error: 'Produto não encontrado' });
    }
};

// POST criar produto (admin)
export const createProduto = async (req: Request, res: Response) => {
    try {
        const { nome, descricao, preco, quantidade_estoque, categoria_id, ativo } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: 'Imagem é obrigatória' });
        }

        // Upload para Cloudinary
        const imagemUrl = await uploadToCloudinary(file.buffer, file.originalname);

        const { data, error } = await supabase
            .from('produtos')
            .insert([
                {
                    nome,
                    descricao,
                    preco: parseFloat(preco),
                    quantidade_estoque: parseInt(quantidade_estoque),
                    categoria_id,
                    ativo: ativo !== 'false',
                    imagem_url: imagemUrl,
                },
            ])
            .select();

        if (error) throw error;

        res.status(201).json(data[0]);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar produto' });
    }
};

// PUT atualizar produto (admin)
export const updateProduto = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { nome, descricao, preco, quantidade_estoque, categoria_id, ativo } = req.body;
        const file = req.file;

        let updateData: any = {
            nome,
            descricao,
            preco: parseFloat(preco),
            quantidade_estoque: parseInt(quantidade_estoque),
            categoria_id,
            ativo: ativo !== 'false',
            updated_at: new Date().toISOString(),
        };

        // Se houver imagem nova, fazer upload
        if (file) {
            const imagemUrl = await uploadToCloudinary(file.buffer, file.originalname);
            updateData.imagem_url = imagemUrl;
        }

        const { data, error } = await supabase
            .from('produtos')
            .update(updateData)
            .eq('id', id)
            .select();

        if (error) throw error;

        res.json(data[0]);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar produto' });
    }
};

// DELETE produto (admin)
export const deleteProduto = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const { error } = await supabase.from('produtos').delete().eq('id', id);

        if (error) throw error;

        res.json({ message: 'Produto deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar produto' });
    }
};