import { api } from "@/services/api";
import type { DashboardFilter, ClientSellsResponse } from "@/features/dashboard/types";
import { useQuery } from "@tanstack/react-query";

export const useClientSells = (filter: DashboardFilter) => {
  const { data, isLoading, error } = useQuery<ClientSellsResponse>({
    queryKey: ["client-sells", filter],
    queryFn: () => api.get<ClientSellsResponse>("/api/dashboard/client_sells", { q: filter }),
    staleTime: 5 * 60 * 1000,
  });

  return { clientSells: data, isLoading, error };
};
