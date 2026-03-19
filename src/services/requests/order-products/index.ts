import { api } from "@/services/api";
import type { CreateOrderProductPayload, OrderProduct } from "./types";

export const OrderProductsService = {
  create: (payload: Pick<CreateOrderProductPayload, "stock_id" | "order_id">) =>
    api.post<{ orderProduct: OrderProduct }>("/api/order_products", {
      order_product: payload,
    }),
  update: (id: number, payload: Partial<CreateOrderProductPayload>) =>
    api.put<{ orderProduct: OrderProduct }>(`/api/order_products/${id}`, {
      order_product: payload,
    }),
  delete: (id: number) => api.delete(`/api/order_products/${id}`),
  bulkInsert: (payload: CreateOrderProductPayload[]) =>
    api.post<void>("/api/order_products/bulk_insert", {
      order_products: payload,
    }),
};
