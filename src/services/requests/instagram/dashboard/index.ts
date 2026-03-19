import { api } from "@/services/api";
import type { InstagramDashboardResponse } from "./types";

export const InstagramDashboardRequests = {
  show: () => api.get<InstagramDashboardResponse>("/api/instagram/dashboard"),
};
