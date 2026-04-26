import { api } from "@/services/api";

export type NotificationResponse = {
  calendarEventsToday: number;
};

export const fetchNotifications = () =>
  api.get<NotificationResponse>("/api/notifications");
