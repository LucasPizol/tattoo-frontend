import { api } from "@/services/api";
import type { Note, NotePriority, NoteStatus, NoteFilters } from "../../types";
import { useQuery } from "@tanstack/react-query";

type NotesQueryFilters = {
  title_or_description_cont?: string;
  status_in?: { label: string; value: NoteStatus }[];
  priority_in?: { label: string; value: NotePriority }[];
};

export const useNotesListQuery = (filters: NotesQueryFilters) =>
  useQuery({
    queryKey: ["notes", filters],
    queryFn: () =>
      api.get<{ notes: Note[] }>("/api/notes", {
        q: {
          ...filters,
          status_in: filters.status_in?.map(
            (status) => status.value as NoteStatus
          ),
          priority_in: filters.priority_in?.map(
            (priority) => priority.value as NotePriority
          ),
        } as NoteFilters,
      }),
  });
