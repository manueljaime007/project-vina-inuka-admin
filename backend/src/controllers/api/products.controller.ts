import { Request, Response } from 'express';
import { supabase } from '../../config/supabase';
import { uploadToCloudinary } from '../../utils/cloudinary-upload';
import { Produto } from '../../types';

export const getProducts = async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select(`
                *,
                categories (
                    name
                )
            `)
            .eq('active', true)
            .is('deleted_at', null);

        if (error) throw error;

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('products')
            .select(`
                *,
                categories (
                    name
                )
            `)
            .eq('id', id)
            .is('deleted_at', null)
            .single();

        if (error) throw error;

        res.json(data);
    } catch (error) {
        res.status(404).json({ error: 'Produto não encontrado' });
    }
};

export const createProduct = async (req: Request, res: Response) => {
    try {
        const {
            name,
            description,
            price,
            stock,
            category_id,
            active
        } = req.body;

        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: 'Imagem é obrigatória' });
        }

        const imageUrl = await uploadToCloudinary(
            file.buffer,
            file.originalname
        );

        const { data, error } = await supabase
            .from('products')
            .insert([
                {
                    name,
                    description,
                    price: parseFloat(price),
                    stock: parseInt(stock),
                    category_id,
                    active: active !== 'false',
                    image_url: imageUrl,
                },
            ])
            .select();

        if (error) throw error;

        res.status(201).json(data[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar produto' });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const {
            name,
            description,
            price,
            stock,
            category_id,
            active
        } = req.body;
        const file = req.file;

        const { data: existingProduct, error: checkError } = await supabase
            .from('products')
            .select('id')
            .eq('id', id)
            .is('deleted_at', null)
            .single();

        if (checkError || !existingProduct) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        let updateData: any = {
            name,
            description,
            price: parseFloat(price),
            stock: parseInt(stock),
            category_id,
            active: active !== 'false',
            updated_at: new Date().toISOString(),
        };

        if (file) {
            const imageUrl = await uploadToCloudinary(file.buffer, file.originalname);
            updateData.image_url = imageUrl;
        }

        const { data, error } = await supabase
            .from('products')
            .update(updateData)
            .eq('id', id)
            .select();

        if (error) throw error;

        res.json(data[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar produto' });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('products')
            .update({
                deleted_at: new Date().toISOString(),
                active: false,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .is('deleted_at', null)
            .select();

        if (error) throw error;

        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        res.json({ message: 'Produto deletado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao deletar produto' });
    }
};

export const restoreProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('products')
            .update({
                deleted_at: null,
                active: true,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .not('deleted_at', 'is', null)
            .select();

        if (error) throw error;

        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'Produto não encontrado ou já está ativo' });
        }

        res.json({ message: 'Produto restaurado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao restaurar produto' });
    }
};

export const getDeletedProducts = async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select(`
                *,
                categories (
                    name
                )
            `)
            .not('deleted_at', 'is', null);

        if (error) throw error;

        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar produtos deletados' });
    }
};