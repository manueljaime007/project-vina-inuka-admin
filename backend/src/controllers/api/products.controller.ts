import { Request, Response } from 'express';
import { supabase } from '@/config/supabase';
import { uploadToCloudinary } from '../../utils/cloudinary-upload';
import { slugify } from '@/utils/slugify';

export const getProducts = async (req: Request, res: Response) => {
    try {
        const {
            page = 1,
            limit = 10,
            sortBy = 'created_at',
            sortOrder = 'desc',
            search = '',
            category_id,
            minPrice,
            maxPrice,
            active
        } = req.query;

        const pageNum = Math.max(1, parseInt(page as string) || 1);
        const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 10));
        const offset = (pageNum - 1) * limitNum;

        let query = supabase
            .from('products')
            .select(`
                *,
                categories (
                    name
                )
            `, { count: 'exact' });

        query = query.is('deleted_at', null);

        if (active !== undefined) {
            query = query.eq('active', active === 'true' || active === '1');
        }

        if (category_id) {
            query = query.eq('category_id', category_id);
        }

        if (minPrice) {
            query = query.gte('price', parseFloat(minPrice as string));
        }

        if (maxPrice) {
            query = query.lte('price', parseFloat(maxPrice as string));
        }

        if (search) {
            query = query.ilike('name', `%${search}%`);
        }

        const validSortFields = ['name', 'price', 'stock', 'created_at', 'updated_at'];
        const sortField = validSortFields.includes(sortBy as string) ? sortBy : 'created_at';
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
                category_id: category_id || null,
                minPrice: minPrice || null,
                maxPrice: maxPrice || null,
                active: active !== undefined ? active : null,
                search: search || null
            },
            sort: {
                sortBy: sortField,
                sortOrder: sortDir
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
};

export const getProductBySlug = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;

        const { data, error } = await supabase
            .from('products')
            .select(`
                *,
                categories (
                    name
                )
            `)
            .eq('slug', slug)
            .is('deleted_at', null)
            .single();

        if (error) throw error;

        res.json(data);
    } catch (error) {
        res.status(404).json({ error: 'Produto não encontrado' });
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

export const getDeletedProducts = async (req: Request, res: Response) => {
    try {
        const { data, count, error } = await supabase
            .from('products')
            .select(`
                *,
                categories (
                    name
                )
            `, { count : 'exact'})
            .not('deleted_at', 'is', null)

        if (error) throw error;

        res.json(data);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar produtos deletados' });
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
            active,
            slug: slugInput
        } = req.body;
        const file = req.file;

        if (!name || !category_id) {
            return res.status(400).json({ error: 'Nome e categoria são obrigatórios' });
        }
        if (!file) {
            return res.status(400).json({ error: 'Imagem é obrigatória' });
        }

        const imageUrl = await uploadToCloudinary(file.buffer, file.originalname);

        const finalSlug = slugInput && slugInput.trim()
            ? slugify(slugInput)
            : slugify(name);

        const productData = {
            name,
            slug: finalSlug,
            description: description || null,
            price: parseFloat(price),
            stock: parseInt(stock),
            category_id,
            active: active !== 'false' && active !== false,
            image_url: imageUrl,
        };

        const { data, error } = await supabase
            .from('products')
            .insert([productData])
            .select(`
                *,
                categories (name)
            `);

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }

        res.status(201).json(data[0]);
    } catch (error: any) {
        console.error('Erro ao criar produto:', error);
        res.status(500).json({
            error: 'Erro ao criar produto',
            details: error.message
        });
    }
};


export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, slug: slugInput, description, price, stock, category_id, active } = req.body;
        const file = req.file;

        const { data: existingProduct, error: findError } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .is('deleted_at', null)
            .single();

        if (findError || !existingProduct) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        const updateData: any = {
            updated_at: new Date().toISOString(),
        };

        if (name !== undefined) updateData.name = name.trim();
        if (description !== undefined) updateData.description = description?.trim() || null;
        if (price !== undefined) updateData.price = parseFloat(price);
        if (stock !== undefined) updateData.stock = parseInt(stock);
        if (category_id !== undefined) updateData.category_id = category_id;
        if (active !== undefined) updateData.active = active !== 'false' && active !== false;

        if (slugInput !== undefined) {
            updateData.slug = slugify(slugInput);
        } else if (name !== undefined) {
            updateData.slug = slugify(name);
        }

        if (file) {
            const imageUrl = await uploadToCloudinary(file.buffer, file.originalname);
            updateData.image_url = imageUrl;
        }


        const { data, error } = await supabase
            .from('products')
            .update(updateData)
            .eq('id', id)
            .select(`
                *,
                categories (name)
            `);

        if (error) throw error;

        res.json(data[0]);
    } catch (error: any) {
        console.error('Erro ao atualizar produto:', error);
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

export const deletePermanently = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('products')
            .delete()
            .eq('id', id)
            .select();

        if (error) throw error;

        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        res.json({ message: 'Produto deletado permanentemente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao deletar produto permanentemente' });
    }
};

export const deleteManyProducts = async (req: Request, res: Response) => {
    try {
        const { ids } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: 'Envie um array de IDs válido' });
        }

        if (ids.length > 100) {
            return res.status(400).json({ error: 'Máximo de 100 produtos por vez' });
        }

        const { data, error } = await supabase
            .from('products')
            .update({
                deleted_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                active: false
            })
            .in('id', ids)
            .is('deleted_at', null)
            .select('id');

        if (error) throw error;

        res.json({
            success: true,
            deletedCount: data?.length || 0,
            deletedIds: data?.map(p => p.id) || []
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao deletar produtos' });
    }
};

export const restoreManyProducts = async (req: Request, res: Response) => {
    try {
        const { ids } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: 'Envie um array de IDs válido' });
        }

        if (ids.length > 100) {
            return res.status(400).json({ error: 'Máximo de 100 produtos por vez' });
        }

        const { data, error } = await supabase
            .from('products')
            .update({
                deleted_at: null,
                updated_at: new Date().toISOString(),
                active: true
            })
            .in('id', ids)
            .not('deleted_at', 'is', null)
            .select('id');

        if (error) throw error;

        res.json({
            success: true,
            restoredCount: data?.length || 0,
            restoredIds: data?.map(p => p.id) || []
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao restaurar produtos' });
    }
};

export const deleteManyProductsPermanent = async (req: Request, res: Response) => {
    try {
        const { ids } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                error: 'Envie um array de IDs válido'
            });
        }

        if (ids.length > 100) {
            return res.status(400).json({
                error: 'Máximo de 100 produtos por vez'
            });
        }

        const { data, error } = await supabase
            .from('products')
            .delete()
            .in('id', ids)
            .select('id');

        if (error) throw error;

        res.json({
            success: true,
            deletedCount: data?.length || 0,
            deletedIds: data?.map(p => p.id) || []
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao deletar produtos permanentemente' });
    }
};