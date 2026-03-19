import { api } from "@/services/api";
import type { CalendarEvent, CalendarEventFilters, CreateCalendarEventPayload } from "./types";

export const CalendarEventsService = {
  index: (filters: CalendarEventFilters) =>
    api.get<{ calendarEvents: CalendarEvent[] }>("/api/calendar_events", {
      params: filters,
    }),
  create: (payload: CreateCalendarEventPayload) =>
    api.post<{ calendarEvent: CalendarEvent }>("/api/calendar_events", {
      calendar_event: payload,
    }),
  update: (id: number, payload: CreateCalendarEventPayload) =>
    api.put<{ calendarEvent: CalendarEvent }>(`/api/calendar_events/${id}`, {
      calendar_event: payload,
    }),
  delete: (id: number) => api.delete(`/api/calendar_events/${id}`),
};
