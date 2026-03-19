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
  commission_percentage: number;
  paid_at: string;
};

export type ComissionUser = {
  id: number;
  name: string;
  commission_percentage: number;
  payer: "user" | "company";
  total_value_cents: number;
  total_value: MoneyValue;
  orders_count: number;
  orders: ComissionOrder[];
};

export type ComissionSummary = {
  total_to_pay: MoneyValue;
  total_to_receive: MoneyValue;
  balance: MoneyValue;
};

export type ComissionsResponse = {
  users: ComissionUser[];
  summary: ComissionSummary;
};

export type ComissionFilters = {
  paid_at_gteq?: string;
  paid_at_lteq?: string;
};
