import { api } from "@/services/api";
import { completeOnboardingStep } from "@/services/requests/onboarding";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

type ClientPayload = {
  client: Record<string, unknown>;
  addresses?: Record<string, unknown>[];
  responsible?: Record<string, unknown>;
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ClientPayload) =>
      api.post("/api/clients", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Cliente criado com sucesso");

      const session = queryClient.getQueryData<{
        company: { onboarding_steps: { first_client: boolean } };
      }>(["session"]);
      const alreadyDone = session?.company?.onboarding_steps?.first_client;

      if (!alreadyDone) {
        completeOnboardingStep("first_client")
          .then(() => {
            queryClient.invalidateQueries({ queryKey: ["session"] });
            queryClient.invalidateQueries({ queryKey: ["onboarding", "status"] });
          })
          .catch(() => {});
      }
    },
    onError: () => {
      toast.error("Erro ao criar cliente");
    },
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ClientPayload }) =>
      api.put(`/api/clients/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Cliente atualizado com sucesso");
    },
    onError: () => {
      toast.error("Erro ao atualizar cliente");
    },
  });
};

export const useDeleteClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.delete<void>(`/api/clients/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Cliente excluído com sucesso");
    },
    onError: () => {
      toast.error("Erro ao excluir cliente");
    },
  });
};
