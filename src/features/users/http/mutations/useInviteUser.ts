import { api } from "@/services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useInviteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { phone: string; role: number; commission_percentage: number }) => {
      const response = await api.post<{ message: string }>("/api/user_invites", {
        phone: data.phone,
        role: data.role,
        commission_percentage: data.commission_percentage,
      });
      return response.message;
    },
    onSuccess: () => {
      toast.success("Convite enviado com sucesso");
      queryClient.invalidateQueries({ queryKey: ["user-invites"] });
    },
    onError: () => {
      toast.error("Erro ao enviar convite");
    },
  });
};
