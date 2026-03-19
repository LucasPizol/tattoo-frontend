import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NotesSchema, type NotesForm } from "@/schemas/notes";
import { api } from "@/services/api";
import type { AddNoteRequest, Note, UpdateNoteRequest } from "../types";
import { useQueryClient } from "@tanstack/react-query";

export const useNoteForm = (note: Note | null) => {
  const queryClient = useQueryClient();

  const form = useForm<NotesForm>({
    resolver: zodResolver(NotesSchema.schema),
    defaultValues: NotesSchema.defaultValues,
  });

  const onSubmit = async (data: NotesForm) => {
    if (note) {
      await api.put(`/api/notes/${note.id}`, data as UpdateNoteRequest);
    } else {
      await api.post("/api/notes", data as AddNoteRequest);
    }
    form.reset();
    queryClient.invalidateQueries({
      predicate: (query) => query.queryKey[0] === "notes"
    });
  };

  return {
    form,
    onSubmit,
  };
};
