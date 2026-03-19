import { api } from "@/services/api";
import type { ReportResponse } from "@/features/dashboard/types";
import { useQuery } from "@tanstack/react-query";

export const useReport = () => {
  const { data, isLoading, error } = useQuery<ReportResponse>({
    queryKey: ["report"],
    queryFn: () => api.get<ReportResponse>("/api/dashboard/reports"),
    staleTime: 5 * 60 * 1000,
  });

  return { report: data?.report, isLoading, error };
};
