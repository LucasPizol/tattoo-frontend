import { z } from "zod";

const schema = z.object({
  caption: z.string().min(1, { message: "Legenda é obrigatória" }),
  contents: z
    .array(z.instanceof(File))
    .refine((files) => files.every((file) => file.size <= 1024 * 1024 * 5), {
      message: "Imagem deve ter no máximo 5MB",
    }),
  accounts: z.array(
    z.object({
      value: z.string(),
      label: z.string(),
    })
  ),
});

export type InstagramPostForm = z.infer<typeof schema>;

const defaultValues: InstagramPostForm = {
  caption: "",
  contents: [],
  accounts: [],
};

export const InstagramPostSchema = {
  schema,
  defaultValues,
};
