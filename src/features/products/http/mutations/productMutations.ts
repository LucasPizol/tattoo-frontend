import { api } from "@/services/api";
import type { ProductShowResponse } from "../../types";
import { completeOnboardingStep } from "@/services/requests/onboarding";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) =>
      api.post<ProductShowResponse>("/api/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "products",
      });
      toast.success("Produto criado com sucesso");

      const session = queryClient.getQueryData<{
        company: { onboarding_steps: { first_product: boolean } };
      }>(["session"]);
      const alreadyDone = session?.company?.onboarding_steps?.first_product;

      if (!alreadyDone) {
        completeOnboardingStep("first_product")
          .then(() => {
            queryClient.invalidateQueries({ queryKey: ["session"] });
            queryClient.invalidateQueries({ queryKey: ["onboarding", "status"] });
          })
          .catch(() => {});
      }
    },
    onError: () => {
      toast.error("Erro ao criar produto");
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      api.put<ProductShowResponse>(`/api/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "products",
      });
      toast.success("Produto atualizado com sucesso");
    },
    onError: () => {
      toast.error("Erro ao atualizar produto");
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.delete(`/api/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "products",
      });
      toast.success("Produto excluído com sucesso");
    },
    onError: () => {
      toast.error("Erro ao excluir produto");
    },
  });
};
