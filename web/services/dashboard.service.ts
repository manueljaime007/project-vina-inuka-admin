import { api } from './api.service';

export interface DashboardStats {
    products: number;
    categories: number;
    requests: {
        total: number;
        pending: number;
    };
    revenue: number;
    recentRequests: {
        id: string;
        customer_name: string;
        customer_phone: string;
        total: number;
        status: 'pending' | 'completed' | 'cancelled';
        created_at: string;
    }[];
}

export interface DashboardResponse {
    success: boolean;
    data: DashboardStats
}

export const dashboardService = {
    getStats: () => {
        return api.get<DashboardResponse>('/dashboard');
    },
};