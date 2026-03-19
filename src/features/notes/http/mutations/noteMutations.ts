import { api } from "@/services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import type { AddNoteRequest, NoteStatus, UpdateNoteRequest } from "../../types";

export const useCreateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddNoteRequest) =>
      api.post("/api/notes", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Nota criada com sucesso");
    },
    onError: () => {
      toast.error("Erro ao criar nota");
    },
  });
};

export const useUpdateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateNoteRequest }) =>
      api.put(`/api/notes/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Nota atualizada com sucesso");
    },
    onError: () => {
      toast.error("Erro ao atualizar nota");
    },
  });
};

export const useDeleteNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/notes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Nota deletada com sucesso");
    },
    onError: () => {
      toast.error("Erro ao deletar nota");
    },
  });
};

export const useUpdateNoteStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: NoteStatus }) =>
      api.put(`/api/notes/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: () => {
      toast.error("Erro ao atualizar status da nota");
    },
  });
};
