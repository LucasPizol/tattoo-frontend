import { api } from "@/services/api";
import type { DashboardFilter, SellersResponse } from "@/features/dashboard/types";
import { useQuery } from "@tanstack/react-query";

export const useSellers = (filters: DashboardFilter) => {
  const { data, isLoading, refetch } = useQuery<SellersResponse>({
    queryKey: ["sellers", filters],
    queryFn: () => api.get<SellersResponse>("/api/dashboard/sellers", { q: filters }),
    staleTime: 5 * 60 * 1000,
  });

  return {
    sellers: data,
    isLoading,
    refetch,
  };
};
