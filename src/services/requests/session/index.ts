import { api } from "@/services/api";
import type { LoginPayload, LoginResponse } from "./types";

export const SessionRequests = {
  login: (payload: LoginPayload) =>
    api.post<LoginResponse>("/api/sessions", payload),
  me: () => api.get<LoginResponse>("/api/sessions"),
  logout: () => api.delete("/api/sessions"),
  refresh: async () => {
    try {
      await api.post<void>("/api/sessions/refresh");
    } catch (error) {
      localStorage.removeItem("is_authenticated");
      window.location.href = "/login";
      throw error;
    }
  },
};
