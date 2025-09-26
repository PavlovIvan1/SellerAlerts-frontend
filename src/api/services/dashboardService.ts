import api from '../axios'
import type { Dashboard, PaginationResult } from '../types'

interface GetDashboardsResponse {
  data: Dashboard[];
  pagination: PaginationResult;
}

export const getDashboards = (params?: {
  supplier_id?: number[];
  offset?: number;
  limit?: number;
  sort_by?: 'time';
  order?: 'ASC' | 'DESC';
}) => api.get<GetDashboardsResponse>('/dashboards', { params });
