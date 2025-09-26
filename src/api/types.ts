// Pagination
export interface PaginationResult {
  offset: number;
  limit: number;
  total: number;
}

// Supplier
export interface Supplier {
  supplier_id: string;
  name: string;
  consumers: ('auto_tables' | 'auto_jam' | 'dashboard')[];
  active_token: boolean;
  users: { id: number }[];
}

// Dashboard
export interface DashboardStats {
  vendor_code: string;
  orders_sum: number;
  orders_count: number;
  drr: number;
  ctr: number;
  cpc: number;
  nm_id: number | null;
}

export interface DashboardValueData {
  orders_sum: number;
  drr: number;
  ctr: number;
  cpc: number;
}

export interface Dashboard {
  time: string; // ISO date
  supplier: Supplier;
  current_data: DashboardValueData;
  old_data: DashboardValueData | null;
  stats: DashboardStats[] | null;
}

// Token Scope
export interface Scope {
  value: number;
  type: 'REQUIRED' | 'OPTIONAL';
}
