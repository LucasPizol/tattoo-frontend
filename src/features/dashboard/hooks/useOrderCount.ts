import { api } from "@/services/api";
import type { DashboardFilter, OrderCountResponse } from "@/features/dashboard/types";
import { useQuery } from "@tanstack/react-query";

export const useOrderCount = (filter: DashboardFilter) => {
  const { data, isLoading, error } = useQuery<OrderCountResponse>({
    queryKey: ["order-count", filter],
    queryFn: () => api.get<OrderCountResponse>("/api/dashboard/order_counts", { q: filter }),
    staleTime: 5 * 60 * 1000,
  });

  return { orderCount: data, isLoading, error };
};
