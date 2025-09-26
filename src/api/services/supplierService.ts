import api from '../axios'
import type { PaginationResult, Supplier } from '../types'

interface GetSuppliersResponse {
  data: Supplier[];
  pagination: PaginationResult;
}

export const getSuppliers = (params?: {
  offset?: number;
  limit?: number;
  sort_by?: 'supplier_id';
  order?: 'ASC' | 'DESC';
}) => api.get<GetSuppliersResponse>('/suppliers', { params });
