import { api } from "@/services/api";
import type { NotificationResponse } from "./types";

export const NotificationsRequests = {
  get: () => api.get<NotificationResponse>("/api/notifications"),
};
