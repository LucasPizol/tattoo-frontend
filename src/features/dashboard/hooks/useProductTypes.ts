import { api } from "@/services/api";
import type { DashboardFilter, ProductTypesResponse } from "@/features/dashboard/types";
import { useQuery } from "@tanstack/react-query";

export const useProductTypes = (filter: DashboardFilter) => {
  const { data, isLoading, error } = useQuery<ProductTypesResponse>({
    queryKey: ["product-types", filter],
    queryFn: () => api.get<ProductTypesResponse>("/api/dashboard/product_types", { q: filter }),
    staleTime: 5 * 60 * 1000,
  });

  return { productTypes: data, isLoading, error };
};
