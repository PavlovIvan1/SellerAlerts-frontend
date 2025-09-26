import api from '../axios';
import type { SuppliersResponse } from '../types';

export const getSuppliers = (params?: {
  offset?: number;
  limit?: number;
  sort_by?: string; // backend default: created_at
  order?: 'ASC' | 'DESC';
}) => api.get<SuppliersResponse>('/suppliers', { params });
