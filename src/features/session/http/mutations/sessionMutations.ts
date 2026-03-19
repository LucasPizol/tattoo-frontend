import { api } from "@/services/api";
import type { LoginPayload, LoginResponse } from "../../types";

export const sessionLogin = (payload: LoginPayload) =>
  api.post<LoginResponse>("/api/sessions", payload);

export const sessionMe = () => api.get<LoginResponse>("/api/sessions");

export const sessionLogout = () => api.delete("/api/sessions");

export const sessionRefresh = async () => {
  try {
    await api.post<void>("/api/sessions/refresh");
  } catch (error) {
    localStorage.removeItem("is_authenticated");
    window.location.href = "/login";
    throw error;
  }
};
