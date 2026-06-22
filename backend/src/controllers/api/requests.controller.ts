import { Request, Response } from 'express';
import { supabase } from '../../config/supabase';

// POST criar solicitação (público)
export const createSolicitacao = async (req: Request, res: Response) => {
    try {
        const { cliente_nome, cliente_telefone, cliente_email, produtos, total, mensagem_whatsapp } =
            req.body;

        const { data, error } = await supabase
            .from('solicitacoes')
            .insert([
                {
                    cliente_nome,
                    cliente_telefone,
                    cliente_email,
                    produtos,
                    total,
                    mensagem_whatsapp,
                    status: 'pendente',
                },
            ])
            .select();

        if (error) throw error;

        res.status(201).json(data[0]);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar solicitação' });
    }
};

// GET todas as solicitações (admin)
export const getSolicitacoes = async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('solicitacoes')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar solicitações' });
    }
};

// GET uma solicitação específica (admin)
export const getSolicitacaoById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('solicitacoes')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        res.json(data);
    } catch (error) {
        res.status(404).json({ error: 'Solicitação não encontrada' });
    }
};

// PUT atualizar status da solicitação (admin)
export const updateSolicitacaoStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const { data, error } = await supabase
            .from('solicitacoes')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select();

        if (error) throw error;

        res.json(data[0]);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar solicitação' });
    }
};