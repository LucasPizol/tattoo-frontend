import { api } from "@/services/api";
import type { DashboardFilter, MaterialsResponse } from "@/features/dashboard/types";
import { useQuery } from "@tanstack/react-query";

export const useCategories = (filter: DashboardFilter) => {
  const { data, isLoading, error } = useQuery<MaterialsResponse>({
    queryKey: ["categories-dashboard", filter],
    queryFn: () => api.get<MaterialsResponse>("/api/dashboard/materials", { q: filter }),
    staleTime: 5 * 60 * 1000,
  });

  return { categories: data, isLoading, error };
};
