import { api } from "@/services/api";
import { useMutation } from "@tanstack/react-query";
import type { ResponsibleCreatePayload } from "../../types/responsible";
import { toast } from "react-hot-toast";

export const useCreateResponsible = () =>
  useMutation({
    mutationFn: (payload: ResponsibleCreatePayload) =>
      api.post("/api/responsibles", payload),
    onSuccess: () => {
      toast.success("Responsável criado com sucesso");
    },
    onError: () => {
      toast.error("Erro ao criar responsável");
    },
  });
