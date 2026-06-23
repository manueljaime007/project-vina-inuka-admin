import { Request, Response } from 'express';
import { supabase } from '../../config/supabase';

export const createRequest = async (req: Request, res: Response) => {
    try {
        const {
            customer_name,
            customer_phone,
            products,
            total
        } = req.body;

        if (!customer_name || !customer_phone || !products || !total) {
            return res.status(400).json({
                error: 'Todos os campos são obrigatórios'
            });
        }

        const { data, error } = await supabase
            .from('requests')
            .insert([
                {
                    customer_name,
                    customer_phone,
                    products,
                    total: parseFloat(total),
                    status: 'pending'
                },
            ])
            .select();

        if (error) throw error;

        res.status(201).json(data[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar solicitação' });
    }
};


export const getRequests = async (req: Request, res: Response) => {
    try {
        const {
            page = 1,
            limit = 10,
            sortBy = 'created_at',
            sortOrder = 'desc',
            status,
            startDate,
            endDate
        } = req.query;

        const pageNum = Math.max(1, parseInt(page as string) || 1);
        const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 10));
        const offset = (pageNum - 1) * limitNum;

        let query = supabase
            .from('requests')
            .select('*', { count: 'exact' });

        query = query.is('deleted_at', null);

        if (status) {
            query = query.eq('status', status);
        }

        if (startDate) {
            query = query.gte('created_at', startDate);
        }

        if (endDate) {
            query = query.lte('created_at', endDate);
        }

        const validSortFields = ['customer_name', 'total', 'status', 'created_at'];
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
                status: status || null,
                startDate: startDate || null,
                endDate: endDate || null
            },
            sort: {
                sortBy: sortField,
                sortOrder: sortDir
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar solicitações' });
    }
};




export const getRequestById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('requests')
            .select('*')
            .eq('id', id)
            .is('deleted_at', null)
            .single();

        if (error) throw error;

        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(404).json({ error: 'Solicitação não encontrada' });
    }
};

export const updateRequestStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: 'Dados da requisição são obrigatórios' });
        }

        if (!status || !['pending', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({ error: 'Status inválido' });
        }

        const { data: existingRequest, error: checkError } = await supabase
            .from('requests')
            .select('id')
            .eq('id', id)
            .is('deleted_at', null)
            .single();

        if (checkError || !existingRequest) {
            return res.status(404).json({ error: 'Solicitação não encontrada' });
        }

        const { data, error } = await supabase
            .from('requests')
            .update({
                status,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select();

        if (error) throw error;

        res.json(data[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar solicitação' });
    }
};

export const deleteRequest = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('requests')
            .update({
                deleted_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .is('deleted_at', null)
            .select();

        if (error) throw error;

        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'Solicitação não encontrada' });
        }

        res.json({ message: 'Solicitação deletada com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao deletar solicitação' });
    }
};

export const getDeletedRequests = async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('requests')
            .select('*')
            .not('deleted_at', 'is', null)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar solicitações deletadas' });
    }
};

export const restoreRequest = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('requests')
            .update({
                deleted_at: null,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .not('deleted_at', 'is', null)
            .select();

        if (error) throw error;

        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'Solicitação não encontrada ou já está ativa' });
        }

        res.json({ message: 'Solicitação restaurada com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao restaurar solicitação' });
    }
};