import { api } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import type { Category, CategoryFilters } from "../../types";

export const useCategoryListQuery = (
  filters: CategoryFilters = {},
  disabled = false,
) =>
  useQuery({
    queryKey: ["categories", filters],
    queryFn: () =>
      api.get<{ materials: Category[] }>("/api/materials", { q: filters }),
    enabled: !disabled,
    staleTime: 5 * 60 * 1000,
  });
