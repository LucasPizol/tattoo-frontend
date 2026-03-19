import { NotePriority, NoteStatus } from "@/features/notes/types";
import { z } from "zod";

const schema = z.object({
  title: z.string(),
  description: z.string(),
  status: z.enum(NoteStatus).optional(),
  priority: z.enum(NotePriority).optional(),
  due_date: z.string().optional(),
});

const defaultValues: NotesForm = {
  title: "",
  description: "",
  status: NoteStatus.OPEN,
  priority: NotePriority.LOW,
  due_date: "",
};

export type NotesForm = z.infer<typeof schema>;

export const NotesSchema = {
  schema,
  defaultValues,
};
