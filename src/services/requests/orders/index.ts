import type { Pagination, PaginationResponse } from "@/models/Pagination";
import { api } from "@/services/api";
import {
  OrderStatus,
  type OrderCreatePayload,
  type OrderFilters,
  type OrderShowResponse,
  type OrderWithProduct,
} from "./types";

export const OrderRequests = {
  create: () =>
    api.post<OrderShowResponse>("/api/orders", {
      order: { status: OrderStatus.PENDING },
    }),
  index: (data: Pagination & { q?: OrderFilters }) =>
    api.get<PaginationResponse<OrderWithProduct>>("/api/orders", data),
  show: (id: number) => api.get<OrderShowResponse>(`/api/orders/${id}`),
  update: (id: number, payload: Partial<OrderCreatePayload>) =>
    api.put<OrderShowResponse>(`/api/orders/${id}`, {
      order: payload,
    }),
  delete: (id: number) => api.delete(`/api/orders/${id}`),
  reopen: (id: number) =>
    api.put<OrderShowResponse>(`/api/orders/${id}/reopen`),
};
