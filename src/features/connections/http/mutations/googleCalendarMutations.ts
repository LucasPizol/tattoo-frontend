import { api } from "@/services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useConnectGoogleCalendar = () => {
  return useMutation({
    mutationFn: () =>
      api.get<{ url: string }>("/api/integrations/google_calendar/connect"),
    onSuccess: ({ url }) => {
      window.location.href = url;
    },
    onError: () => {
      toast.error("Erro ao iniciar conexão com o Google Calendar");
    },
  });
};

export const useDisconnectGoogleCalendar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      api.delete<void>("/api/integrations/google_calendar"),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["google-calendar-status"],
      });
      toast.success("Google Calendar desconectado");
    },
    onError: () => {
      toast.error("Erro ao desconectar Google Calendar");
    },
  });
};
