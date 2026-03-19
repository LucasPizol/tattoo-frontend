import { api } from "@/services/api";
import type { ComissionFilters, ComissionsResponse } from "../../types";

export const ComissionRequests = {
  index: (filters: ComissionFilters) =>
    api.get<ComissionsResponse>("/api/dashboard/comissions", { q: filters }),
};
