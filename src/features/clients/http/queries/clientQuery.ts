import { useQueryPagination } from "@/hooks/useQueryPagination";
import type { Pagination, PaginationResponse } from "@/models/Pagination";
import type { ClientFilters } from "@/schemas/client/filters";
import { api } from "@/services/api";
import type { Client } from "@/features/clients/types";

type UseClientListQueryProps = {
  enabled?: boolean;
};

export const useClientListQuery = ({
  enabled = true,
}: UseClientListQueryProps = {}) =>
  useQueryPagination({
    queryKey: ["clients"],
    queryFn: (pagination: Pagination & { q?: ClientFilters }) =>
      api.get<PaginationResponse<Client>>("/api/clients", pagination),
    enabled,
  });
