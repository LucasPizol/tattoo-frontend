import { api } from "@/services/api";
import type { ResponsibleCreatePayload } from "./types";

export const ResponsibleRequests = {
  create: (payload: ResponsibleCreatePayload) =>
    api.post("/api/responsibles", payload),
};
