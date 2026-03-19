import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  notes: z.string().optional(),
  parentTag: z
    .object({ id: z.number(), name: z.string() })
    .optional()
    .nullable(),
});

const defaultValues: TagForm = {
  name: "",
  notes: "",
  parentTag: null,
};

export const TagSchema = {
  schema,
  defaultValues,
};

export type TagForm = z.infer<typeof schema>;
