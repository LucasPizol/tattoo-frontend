import {
  NotePriority,
  NoteStatus,
  NoteStatusLabel,
} from "@/features/notes/types";
import { z } from "zod";

export const schema = z.object({
  title_or_description_cont: z.string().optional(),
  status_in: z
    .array(z.object({ label: z.string(), value: z.enum(NoteStatus) }))
    .optional(),
  priority_in: z
    .array(z.object({ label: z.string(), value: z.enum(NotePriority) }))
    .optional(),
  due_date_gte: z.string().optional(),
  due_date_lte: z.string().optional(),
});

export type NotesFilters = z.infer<typeof schema>;

const defaultValues: NotesFilters = {
  title_or_description_cont: "",
  status_in: [
    { label: NoteStatusLabel[NoteStatus.OPEN], value: NoteStatus.OPEN },
  ],
  priority_in: [],
  due_date_gte: "",
  due_date_lte: "",
};

export const NotesFiltersSchema = {
  schema,
  defaultValues,
};
