import type { ProductWithMaterial, Stock } from "../products/types";

export type MoneyValue = {
  value: number;
  currency: string;
  formatted: string;
};

export type OrderProduct = {
  id: number;
  quantity: number;
  value: MoneyValue;
  stock: Stock & { product: ProductWithMaterial };
};

export type CreateOrderProductPayload = {
  quantity: number;
  stock_id: number;
  value: number;
  order_id: number;
};
