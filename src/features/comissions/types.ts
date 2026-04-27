export type MoneyValue = {
  value: number;
  currency: string;
  formatted: string;
};

export type ComissionOrder = {
  id: number;
  client_name: string;
  product_value: MoneyValue;
  commission_value: MoneyValue;
  artist_percentage: number;
  shop_percentage: number;
  paid_at: string;
};

export type ComissionUser = {
  id: number;
  name: string;
  artist_percentage: number;
  shop_percentage: number;
  total_value_cents: number;
  total_value: MoneyValue;
  orders_count: number;
  orders: ComissionOrder[];
};

export type ComissionSummary = {
  total_artist_commissions: MoneyValue;
  total_shop_commissions: MoneyValue;
  total_orders: MoneyValue;
};

export type ComissionsResponse = {
  users: ComissionUser[];
  summary: ComissionSummary;
};

export type ComissionFilters = {
  paid_at_gteq?: string;
  paid_at_lteq?: string;
};
