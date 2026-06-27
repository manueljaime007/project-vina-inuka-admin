import { useState, useEffect } from 'react';
import { dashboardService, DashboardStats } from '@/services/dashboard.service';

export function useDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await dashboardService.getStats();
            setStats(response.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar dashboard');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return { stats, loading, error, refetch: fetchStats };
}