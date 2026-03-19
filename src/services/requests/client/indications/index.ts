import type { Pagination, PaginationResponse } from "@/models/Pagination";
import type { ClientFilters } from "@/schemas/client/filters";
import { api } from "@/services/api";
import type { Indication } from "./types";

export const ClientIndicationsRequests = {
  index: (clientId: number, data: Pagination & { q?: ClientFilters }) =>
    api.get<PaginationResponse<Indication>>(
      `/api/clients/${clientId}/indications`,
      data
    ),
};
