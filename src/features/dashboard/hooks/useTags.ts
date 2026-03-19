import { api } from "@/services/api";
import type { TagsPercentageResponse, DashboardFilter } from "@/features/dashboard/types";
import { useQuery } from "@tanstack/react-query";

export const useTags = (filter: DashboardFilter) => {
  const { data, isLoading, error } = useQuery<TagsPercentageResponse>({
    queryKey: ["tags-dashboard", filter],
    queryFn: () => api.get<TagsPercentageResponse>("/api/dashboard/tags", { q: filter }),
    staleTime: 5 * 60 * 1000,
  });

  return { tags: data, isLoading, error };
};
