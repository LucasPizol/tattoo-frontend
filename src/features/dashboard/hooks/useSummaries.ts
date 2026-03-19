import { api } from "@/services/api";
import type { DashboardFilter, SummariesResponse } from "@/features/dashboard/types";
import { useQuery } from "@tanstack/react-query";

export const useSummaries = (filter: DashboardFilter) => {
  const { data, isLoading, error } = useQuery<SummariesResponse>({
    queryKey: ["summaries", filter],
    queryFn: () => api.get<SummariesResponse>("/api/dashboard/summaries", { q: filter }),
    staleTime: 5 * 60 * 1000,
  });

  return { summary: data, isLoading, error };
};
