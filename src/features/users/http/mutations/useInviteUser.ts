import { api } from "@/services/api";
import { completeOnboardingStep } from "@/services/requests/onboarding";
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

      const session = queryClient.getQueryData<{
        company: { onboarding_steps: { team: boolean } };
      }>(["session"]);
      const alreadyDone = session?.company?.onboarding_steps?.team;

      if (!alreadyDone) {
        completeOnboardingStep("team")
          .then(() => {
            queryClient.invalidateQueries({ queryKey: ["session"] });
            queryClient.invalidateQueries({ queryKey: ["onboarding", "status"] });
          })
          .catch(() => {});
      }
    },
    onError: () => {
      toast.error("Erro ao enviar convite");
    },
  });
};
