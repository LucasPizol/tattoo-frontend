import { api } from "@/services/api";
import type { HomeDashboardResponse } from "../types";
import { useQuery } from "@tanstack/react-query";

export const useHomeDashboard = () => {
  const { data, isLoading, error } = useQuery<HomeDashboardResponse>({
    queryKey: ["home-dashboard"],
    queryFn: () => api.get<HomeDashboardResponse>("/api/dashboard/home"),
    staleTime: 2 * 60 * 1000,
  });

  return { data, isLoading, error };
};
