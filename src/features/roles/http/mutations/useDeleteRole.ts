import { api } from "@/services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id: number) => api.delete<void>(`/api/roles/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Cargo excluído com sucesso");
    },
    onError: () => {
      toast.error("Erro ao excluir cargo");
    },
  });

  return { deleteRole: mutateAsync, isLoading: isPending };
};
