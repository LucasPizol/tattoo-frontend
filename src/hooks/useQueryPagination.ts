import type { Pagination, PaginationResponse } from "@/models/Pagination";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useCustomParams } from "./useCustomParams";

type UseQueryPaginationProps<T, C> = {
  queryKey: string[];
  queryFn: (
    pagination: Pagination & { q?: C },
  ) => Promise<PaginationResponse<T>>;
  staleTime?: number;
  initialFilters?: C;
  initialPagination?: Partial<Pagination>;
  enabled?: boolean;
};

export const useQueryPagination = <T, C>({
  queryKey,
  queryFn,
  staleTime,
  initialFilters,
  initialPagination,
  enabled = true,
}: UseQueryPaginationProps<T, C>) => {
  const [params, setParams] = useCustomParams<{
    page: string;
    per_page: string;
  }>();
  const [filters, setFilters] = useState<C>((initialFilters ?? {}) as C);
  const [totalPages, setTotalPages] = useState(1);

  const [pagination, setPagination] = useState<Pagination>({
    page: params?.page ? Number(params.page) : 1,
    per_page: params.per_page ? Number(params.per_page) : 20,
    ...initialPagination,
  });

  const { data, isLoading, isPending, isRefetching, error, refetch } = useQuery(
    {
      queryKey: [...queryKey, pagination, filters],
      queryFn: () => queryFn({ ...pagination, q: filters }),
      staleTime,
      enabled,
    },
  );

  useEffect(() => {
    if (data?.totalPages) {
      setTotalPages(data.totalPages);
    }
  }, [data]);

  return {
    data: data?.data || [],
    pagination: {
      page: data?.currentPage ?? pagination.page,
      perPage: pagination.per_page,
      totalPages: totalPages,
      onChange: (page: number, perPage: number) => {
        setPagination({ page, per_page: perPage });
        setParams({ page: String(page), per_page: String(perPage) });
      },
    },
    isLoading,
    error,
    refetch,
    filters,
    onChangeFilters: (filters: C) => {
      setFilters(filters);
      setParams({ ...params, filters });
    },
    isPending,
    isRefetching,
  };
};
