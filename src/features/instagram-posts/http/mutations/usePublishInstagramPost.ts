import { api } from "@/services/api";
import type { InstagramPost } from "../../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const usePublishInstagramPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.post<InstagramPost>(`/api/instagram/posts/${id}/publish`),
    onSuccess: () => {
      toast.success("Post publicado com sucesso");
      queryClient.invalidateQueries({ queryKey: ["instagram-posts"] });
    },
    onError: () => {
      toast.error("Erro ao publicar post");
    },
  });
};
