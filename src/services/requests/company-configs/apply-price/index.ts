import { api } from "@/services/api";

const create = () => {
  return api.post("/api/company_config/apply_price");
};

export const ApplyPriceRequests = {
  create,
};
