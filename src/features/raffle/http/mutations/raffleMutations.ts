import { api } from "@/services/api";
import type { RaffleCreatePayload, RaffleShowResponse } from "../../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export const useCreateRaffle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RaffleCreatePayload) =>
      api.post<RaffleShowResponse>("/api/raffles", { raffle: payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["raffles"] });
      toast.success("Sorteio realizado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao realizar sorteio");
    },
  });
};

export const useDrawRaffle = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.post<RaffleShowResponse>(`/api/raffles/${id}/draw`, {}),
    onSuccess: (data) => {
      queryClient.setQueryData(["raffle", id], data);
      queryClient.invalidateQueries({ queryKey: ["raffle", id] });
    },
  });
};

export const useDeleteRaffle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.delete(`/api/raffles/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["raffles"] });
      toast.success("Sorteio excluído com sucesso");
    },
    onError: () => {
      toast.error("Erro ao excluir sorteio");
    },
  });
};
