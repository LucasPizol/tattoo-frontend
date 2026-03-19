import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import type { CalendarEvent, CalendarEventFilters } from "../../types";

export const useCalendarEventListQuery = (filters: CalendarEventFilters) => {
  const { data, isLoading } = useQuery({
    queryKey: ["calendar-events", filters],
    queryFn: () => api.get<{ calendarEvents: CalendarEvent[] }>("/api/calendar_events", { params: filters }),
  });

  return {
    data: data?.calendarEvents || [],
    isLoading,
  };
};
