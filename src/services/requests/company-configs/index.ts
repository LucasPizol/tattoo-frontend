import { api } from "@/services/api";
import type { UserConfigUpdatePayload } from "./types";

const update = (payload: UserConfigUpdatePayload) => {
  return api.put("/api/company_configs", payload);
};

export const UserConfigsRequests = {
  update,
};
