import { api } from "@/services/api";
import type {
  Campaign,
  CreateCampaignPayload,
  UpdateCampaignPayload,
} from "./types";

export const CampaignsService = {
  index: () => api.get<{ campaigns: Campaign[] }>("/api/campaigns"),
  create: (payload: CreateCampaignPayload) =>
    api.post<{ campaign: Campaign }>("/api/campaigns", { campaign: payload }),
  update: (id: number, payload: UpdateCampaignPayload) =>
    api.put<{ campaign: Campaign }>(`/api/campaigns/${id}`, {
      campaign: payload,
    }),
  delete: (id: number) => api.delete(`/api/campaigns/${id}`),
};
