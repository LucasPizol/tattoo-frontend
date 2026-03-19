import { api } from "@/services/api";
import type { RaffleIndexResponse } from "../../types";
import { useQuery } from "@tanstack/react-query";

export const useRaffleListQuery = (page: number) =>
  useQuery({
    queryKey: ["raffles", page],
    queryFn: () => api.get<RaffleIndexResponse>("/api/raffles", { page, per_page: 20 }),
  });
