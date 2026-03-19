import { api } from "@/services/api";
import type { InstagramAccount } from "./types";

export const InstagramAccountsRequests = {
  index: () =>
    api.get<{ instagramAccounts: InstagramAccount[] }>(
      "/api/instagram/accounts"
    ),
  getAuthUrl: () => api.get<{ url: string }>("/api/instagram/redirects"),
  connect: (code: string) =>
    api.get<void>(`/api/instagram/authentications?code=${code}`),
  destroy: (id: number) => api.delete<void>(`/api/instagram/accounts/${id}`),
};
