import type { Pagination, PaginationResponse } from "@/models/Pagination";
import { api } from "@/services/api";
import type {
  StockMovement,
  StockMovementCreatePayload,
  StockMovementFilters,
  StockMovementShowResponse,
} from "./types";

export const StockMovementRequests = {
  create: (payload: StockMovementCreatePayload) =>
    api.post<StockMovementShowResponse>("/api/stock_movements", {
      stock_movement: payload,
    }),
  index: (data: Pagination & { q?: StockMovementFilters }) =>
    api.get<PaginationResponse<StockMovement>>("/api/stock_movements", data),
  show: (id: number) =>
    api.get<StockMovementShowResponse>(`/api/stock_movements/${id}`),
  update: (id: number, payload: Partial<StockMovementCreatePayload>) =>
    api.put<StockMovementShowResponse>(`/api/stock_movements/${id}`, {
      stock_movement: payload,
    }),
  delete: (id: number) => api.delete(`/api/stock_movements/${id}`),
};
