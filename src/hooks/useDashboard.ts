import { getDashboards } from '@api/services/dashboardService';
import type { Dashboard } from '@api/types';
import { useEffect, useState } from 'react';

interface UseDashboardOptions {
  supplierId?: string;
  autoFetch?: boolean;
}

export function useDashboard({ supplierId, autoFetch = true }: UseDashboardOptions = {}) {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboards = async (params?: {
    supplier_id?: string | string[];
    offset?: number;
    limit?: number;
    sort_by?: string;
    order?: 'ASC' | 'DESC';
  }) => {
    if (!supplierId && !params?.supplier_id) {
      setError('Supplier ID is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getDashboards({
        supplier_id: supplierId || params?.supplier_id,
        offset: params?.offset || 0,
        limit: params?.limit || 10,
        sort_by: params?.sort_by || 'created_at',
        order: params?.order || 'DESC',
      });

      setDashboards(response.data.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to fetch dashboards');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch && supplierId) {
      fetchDashboards();
    }
  }, [supplierId, autoFetch]);

  return {
    dashboards,
    loading,
    error,
    fetchDashboards,
    refetch: () => fetchDashboards(),
  };
}
