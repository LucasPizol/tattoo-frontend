import { ComissionsRequests } from "@/services/requests/orders/comissions";
import type { ComissionsCreatePayload } from "@/services/requests/orders/comissions/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export const useCreateComission = (orderId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ComissionsCreatePayload) =>
      ComissionsRequests.create(orderId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", String(orderId)] });
      toast.success("Comissão criada com sucesso");
    },
    onError: () => {
      toast.error("Erro ao criar comissão");
    },
  });
};

export const useUpdateComission = (orderId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ comissionId, ...payload }: ComissionsCreatePayload & { comissionId: number }) =>
      ComissionsRequests.update(orderId, comissionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", String(orderId)] });
      toast.success("Comissão atualizada com sucesso");
    },
    onError: () => {
      toast.error("Erro ao atualizar comissão");
    },
  });
};

export const useDeleteComission = (orderId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (comissionId: number) =>
      ComissionsRequests.delete(orderId, comissionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", String(orderId)] });
      toast.success("Comissão excluída com sucesso");
    },
    onError: () => {
      toast.error("Erro ao excluir comissão");
    },
  });
};
