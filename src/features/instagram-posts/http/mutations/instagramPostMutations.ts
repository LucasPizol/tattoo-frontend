import { api } from "@/services/api";
import type { InstagramPost } from "../../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export const useCreateInstagramPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) =>
      api.post<InstagramPost>("/api/instagram/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          typeof query.queryKey?.[0] === "string" &&
          query.queryKey[0].toLowerCase().includes("instagram-posts"),
      });
      toast.success("Post criado com sucesso");
    },
    onError: () => {
      toast.error("Erro ao criar post");
    },
  });
};

export const useUpdateInstagramPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      api.put<InstagramPost>(`/api/instagram/posts/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          typeof query.queryKey?.[0] === "string" &&
          query.queryKey[0].toLowerCase().includes("instagram-posts"),
      });
      toast.success("Post atualizado com sucesso");
    },
    onError: () => {
      toast.error("Erro ao atualizar post");
    },
  });
};

export const useGenerateInstagramContent = (postId: number) => {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { content } = await api.post<{ content: string }>(
        `/api/instagram/posts/${postId}/generate_content`,
        formData,
      );
      return content;
    },
    onError: () => {
      toast.error("Erro ao gerar conteúdo");
    },
  });
};
