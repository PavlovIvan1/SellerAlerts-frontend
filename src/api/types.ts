// Pagination
export interface PaginationResult {
  offset: number;
  limit: number;
  total: number;
}

// Supplier
export interface SupplierUser {
  id: number;
}

export interface Supplier {
  supplier_id: string;
  name: string;
  consumers: ('auto_tables' | 'auto_jam' | 'dashboard')[];
  active_token: boolean;
  users: SupplierUser[];
}

export interface SuppliersResponse {
  data: Supplier[];
  pagination: PaginationResult;
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

// Dashboard Response
export interface DashboardsResponse {
  data: Dashboard[];
  pagination: PaginationResult;
}

// Token Scope
export interface Scope {
  name: string;
  value: "content" | "contentanalytics" | "discountsandprices" | "marketplace" | "statistics" | "advert" | "questionsandfeedback" | "recommendations" | "buyerchat" | "supplies" | "returns" | "documents" | "read-only";
  type: "REQUIRED" | "OPTIONAL";
}
