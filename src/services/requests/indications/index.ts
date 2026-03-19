import { api } from "@/services/api";
import type { Indication } from "./types";

export const IndicationsRequests = {
  index: (params: { q: { s: string } }) =>
    api.get<{ indications: Indication[] }>("/api/indications", params),
};
