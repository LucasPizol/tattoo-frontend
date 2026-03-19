import { api } from "@/services/api";
import type { AgeResponse, DashboardFilter } from "@/features/dashboard/types";
import { useQuery } from "@tanstack/react-query";

export const useAge = (filter: DashboardFilter) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["age", filter],
    queryFn: () => api.get<AgeResponse>("/api/dashboard/age", { q: filter }),
    staleTime: 5 * 60 * 1000,
  });

  return { age: data, isLoading, error };
};
