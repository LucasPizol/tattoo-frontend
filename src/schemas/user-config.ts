import z from "zod";

const schema = z.object({
  product_percentage_variation: z
    .number({
      error: "A porcentagem de variação deve ser um número",
    })
    .min(-100, { message: "A porcentagem de variação deve ser maior que -100" })
    .max(100, { message: "A porcentagem de variação deve ser menor que 100" }),
});

const defaultValues: UserConfigForm = {
  product_percentage_variation: 0,
};

export type UserConfigForm = z.infer<typeof schema>;

export const UserConfigSchema = {
  schema,
  defaultValues,
};
