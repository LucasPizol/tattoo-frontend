import { api } from "@/services/api";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { AcceptInviteForm } from "../../schema";
import { useNavigate, useParams } from "react-router-dom";

export const useAcceptInvite = () => {
  const params = useParams();
  const navigate = useNavigate();

  const token = params.token as string;

  return useMutation({
    mutationFn: (data: AcceptInviteForm) =>
      api.post<{ message: string }>(
        "/api/user_invites/accept",
        { password: data.password, name: data.name },
        {
          headers: {
            "X-Invite-Token": token,
            "Content-Type": "application/json",
          },
        },
      ),
    onSuccess: () => {
      toast.success("Convite aceito com sucesso");
      navigate("/login");
    },
    onError: () => {
      toast.error("Erro ao aceitar convite");
    },
  });
};
