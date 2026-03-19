import { api } from "@/services/api";
import type { InstagramDashboardResponse } from "@/features/instagram-dashboard/types";
import { useQuery } from "@tanstack/react-query";

export const useInstagramDashboard = () => {
  const { data, isLoading } = useQuery<InstagramDashboardResponse>({
    queryKey: ["instagram-dashboard"],
    queryFn: () => api.get<InstagramDashboardResponse>("/api/instagram/dashboard"),
    staleTime: 5 * 60 * 1000,
  });

  return { data, isLoading };
};
