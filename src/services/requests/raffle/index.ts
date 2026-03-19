import type { Pagination } from "@/models/Pagination";
import { api } from "@/services/api";
import type {
  RaffleCreatePayload,
  RaffleIndexResponse,
  RaffleShowResponse,
} from "./types";

export const RaffleRequests = {
  index: (params?: Pagination) =>
    api.get<RaffleIndexResponse>("/api/raffles", params),
  show: (id: number) => api.get<RaffleShowResponse>(`/api/raffles/${id}`),
  create: (payload: RaffleCreatePayload) =>
    api.post<RaffleShowResponse>("/api/raffles", { raffle: payload }),
  destroy: (id: number) => api.delete(`/api/raffles/${id}`),
};
