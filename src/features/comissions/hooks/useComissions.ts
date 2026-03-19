import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ComissionRequests } from "../http/queries/comissionQueries";
import type { ComissionFilters, ComissionsResponse } from "../types";

const getDefaultFilters = (): ComissionFilters => {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  return {
    paid_at_gteq: startDate.toISOString(),
    paid_at_lteq: endDate.toISOString(),
  };
};

export const useComissions = () => {
  const [filters, setFilters] = useState<ComissionFilters>(getDefaultFilters());

  const { data, isLoading, refetch } = useQuery<ComissionsResponse>({
    queryKey: ["comissions", filters],
    queryFn: () => ComissionRequests.index(filters),
    staleTime: 5 * 60 * 1000,
  });

  const onChangeFilters = (newFilters: ComissionFilters) => {
    setFilters(newFilters);
  };

  return {
    data,
    isLoading,
    refetch,
    filters,
    onChangeFilters,
  };
};
