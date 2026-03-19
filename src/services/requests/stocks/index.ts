import { api } from "@/services/api";

export const StocksRequests = {
  update: (payload: {
    stock: { stock_id?: number; user_id?: number; quantity: number }[];
  }) => api.post<void>(`/api/stocks`, payload),
};
