import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  notes: z.string().optional(),
});

const defaultValues: CategoryForm = {
  name: "",
  notes: "",
};

export const CategorySchema = {
  schema,
  defaultValues,
};

export type CategoryForm = z.infer<typeof schema>;
