import { OrderRequests } from "@/services/requests/orders";
import { completeOnboardingStep } from "@/services/requests/onboarding";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => OrderRequests.create(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Pedido criado com sucesso");

      const session = queryClient.getQueryData<{
        company: { onboarding_steps: { first_order: boolean } };
      }>(["session"]);
      const alreadyDone = session?.company?.onboarding_steps?.first_order;

      if (!alreadyDone) {
        completeOnboardingStep("first_order")
          .then(() => {
            queryClient.invalidateQueries({ queryKey: ["session"] });
            queryClient.invalidateQueries({ queryKey: ["onboarding", "status"] });
          })
          .catch(() => {});
      }
    },
    onError: () => {
      toast.error("Erro ao criar pedido");
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => OrderRequests.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Pedido excluído com sucesso");
    },
    onError: () => {
      toast.error("Erro ao excluir pedido");
    },
  });
};
