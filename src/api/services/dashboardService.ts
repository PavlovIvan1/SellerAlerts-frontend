import api from '../axios';
import type { DashboardsResponse } from '../types';

export const getDashboards = (params?: {
  supplier_id?: string | string[]; // Может быть один или несколько supplier_id
  offset?: number;
  limit?: number;
  sort_by?: string; // Более гибкий тип для sort_by
  order?: 'ASC' | 'DESC';
}) => api.get<DashboardsResponse>('/dashboards', { params });
