import { api } from "@/services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import type { CreatePaymentMethodPayload } from "../../types";

export const useCreatePaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePaymentMethodPayload) =>
      api.post("/api/payment_methods", { payment_method: payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
      toast.success("Método de pagamento criado com sucesso");
    },
    onError: () => {
      toast.error("Erro ao criar método de pagamento");
    },
  });
};

export const useUpdatePaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CreatePaymentMethodPayload }) =>
      api.put(`/api/payment_methods/${id}`, { payment_method: payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
      toast.success("Método de pagamento atualizado com sucesso");
    },
    onError: () => {
      toast.error("Erro ao atualizar método de pagamento");
    },
  });
};

export const useDeletePaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.delete(`/api/payment_methods/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
      toast.success("Método de pagamento excluído com sucesso");
    },
    onError: () => {
      toast.error("Erro ao excluir método de pagamento");
    },
  });
};
