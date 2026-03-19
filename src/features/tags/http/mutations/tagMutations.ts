import { api } from "@/services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

type TagPayload = {
  name: string;
  notes?: string;
  tag_id: number | null;
};

export const useCreateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TagPayload) =>
      api.post("/api/tags", { tag: payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      toast.success("Tag criada com sucesso");
    },
    onError: () => {
      toast.error("Erro ao criar tag");
    },
  });
};

export const useUpdateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: TagPayload }) =>
      api.put(`/api/tags/${id}`, { tag: payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      toast.success("Tag atualizada com sucesso");
    },
    onError: () => {
      toast.error("Erro ao atualizar tag");
    },
  });
};

export const useDeleteTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.delete(`/api/tags/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      toast.success("Tag excluída com sucesso");
    },
    onError: () => {
      toast.error("Erro ao excluir tag");
    },
  });
};
