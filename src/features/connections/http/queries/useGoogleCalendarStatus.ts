import { api } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

export type GoogleCalendarStatus = {
  connected: boolean;
  email: string | null;
  status: "connected" | "disconnected" | null;
};

const fetchGoogleCalendarStatus = async (): Promise<GoogleCalendarStatus> => {
  return api.get<GoogleCalendarStatus>("/api/integrations/google_calendar");
};

export const useGoogleCalendarStatus = () => {
  return useQuery({
    queryKey: ["google-calendar-status"],
    queryFn: fetchGoogleCalendarStatus,
  });
};
