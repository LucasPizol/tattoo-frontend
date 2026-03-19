import { api } from "@/services/api";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useResendInvite = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.post<{ message: string }>(`/api/user_invites/${id}/resend`);
      return response.message;
    },
    onSuccess: () => {
      toast.success("Convite reenviado com sucesso");
    },
    onError: () => {
      toast.error("Erro ao reenviar convite");
    },
  });
};
