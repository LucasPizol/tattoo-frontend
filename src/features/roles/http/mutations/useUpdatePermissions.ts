import { api } from "@/services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export const useUpdatePermissions = (roleId: number) => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (permissions: string[]) => {
      const response = await api.put<{ permissions: string[] }>(`/api/roles/${roleId}/permissions`, { permissions });
      return response.permissions;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["role", roleId] });
      toast.success("Permissões atualizadas com sucesso");
    },
    onError: () => {
      toast.error("Erro ao atualizar permissões");
    },
  });

  return { updatePermissions: mutateAsync, isLoading: isPending };
};
