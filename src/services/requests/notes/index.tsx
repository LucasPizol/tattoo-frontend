import { api } from "@/services/api";
import type {
  AddNoteRequest,
  Note,
  NoteFilters,
  UpdateNoteRequest,
} from "./types";

export const NotesRequests = {
  get: (filters: NoteFilters) =>
    api.get<{ notes: Note[] }>("/api/notes", { q: filters }),
  create: (note: AddNoteRequest) =>
    api.post<{ note: Note }>("/api/notes", note),
  update: (id: string, note: UpdateNoteRequest) =>
    api.put<{ note: Note }>(`/api/notes/${id}`, note),
  delete: (id: string) => api.delete(`/api/notes/${id}`),
};
