import { api } from "@/services/api";
import type { CreateCalendarEventPayload } from "../../types";
import { completeOnboardingStep } from "@/services/requests/onboarding";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export const useCreateCalendarEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCalendarEventPayload) =>
      api.post("/api/calendar_events", { calendar_event: payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendar-events"] });
      toast.success("Evento criado com sucesso");

      const session = queryClient.getQueryData<{
        company: { onboarding_steps: { first_appointment: boolean } };
      }>(["session"]);
      const alreadyDone = session?.company?.onboarding_steps?.first_appointment;

      if (!alreadyDone) {
        completeOnboardingStep("first_appointment")
          .then(() => {
            queryClient.invalidateQueries({ queryKey: ["session"] });
            queryClient.invalidateQueries({ queryKey: ["onboarding", "status"] });
          })
          .catch(() => {});
      }
    },
    onError: () => {
      toast.error("Erro ao criar evento");
    },
  });
};

export const useUpdateCalendarEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCalendarEventPayload & { id: number }) =>
      api.put(`/api/calendar_events/${payload.id}`, { calendar_event: payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendar-events"] });
      toast.success("Evento atualizado com sucesso");
    },
    onError: () => {
      toast.error("Erro ao atualizar evento");
    },
  });
};

export const useDeleteCalendarEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.delete(`/api/calendar_events/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendar-events"] });
      toast.success("Evento deletado com sucesso");
    },
    onError: () => {
      toast.error("Erro ao deletar evento");
    },
  });
};
