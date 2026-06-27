import { Request, Response } from 'express';
import { supabase } from '@/config/supabase';

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const { count: productsCount, error: productsError } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .is('deleted_at', null);

        if (productsError) throw productsError;

        const { count: categoriesCount, error: categoriesError } = await supabase
            .from('categories')
            .select('*', { count: 'exact', head: true });

        if (categoriesError) throw categoriesError;

        const { count: requestsCount, error: requestsError } = await supabase
            .from('requests')
            .select('*', { count: 'exact', head: true })
            .is('deleted_at', null);

        if (requestsError) throw requestsError;

        const { count: pendingRequestsCount, error: pendingError } = await supabase
            .from('requests')
            .select('*', { count: 'exact', head: true })
            .is('deleted_at', null)
            .eq('status', 'pending');

        if (pendingError) throw pendingError;

        const { data: completedRequests, error: revenueError } = await supabase
            .from('requests')
            .select('total')
            .is('deleted_at', null)
            .eq('status', 'completed');

        if (revenueError) throw revenueError;

        const totalRevenue = completedRequests?.reduce((sum, req) => sum + (req.total || 0), 0) || 0;

        const { data: recentRequests, error: recentError } = await supabase
            .from('requests')
            .select('id, customer_name, customer_phone, total, status, created_at')
            .is('deleted_at', null)
            .order('created_at', { ascending: false })
            .limit(5);

        if (recentError) throw recentError;

        const stats = {
            products: productsCount || 0,
            categories: categoriesCount || 0,
            requests: {
                total: requestsCount || 0,
                pending: pendingRequestsCount || 0,
            },
            revenue: totalRevenue,
            recentRequests: recentRequests || [],
        };

        res.json({
            success: true,
            data: stats,
        });
    } catch (error) {
        console.error('Erro ao buscar estatísticas do dashboard:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao carregar dados do dashboard',
        });
    }
};