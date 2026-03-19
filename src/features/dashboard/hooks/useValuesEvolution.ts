import { api } from "@/services/api";
import type { DashboardFilter, ValuesEvolutionResponse } from "@/features/dashboard/types";
import { useQuery } from "@tanstack/react-query";

export const useValuesEvolution = (filter: DashboardFilter) => {
  const { data, isLoading, error } = useQuery<ValuesEvolutionResponse>({
    queryKey: ["values-evolution", filter],
    queryFn: () => api.get<ValuesEvolutionResponse>("/api/dashboard/values_evolutions", { q: filter }),
    staleTime: 5 * 60 * 1000,
  });

  return { valuesEvolution: data, isLoading, error };
};
