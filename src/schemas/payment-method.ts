import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  taxes: z.string().min(1, { message: "Taxa é obrigatória" }),
});

const defaultValues: PaymentMethodForm = {
  name: "",
  taxes: "",
};

export const PaymentMethodSchema = {
  schema,
  defaultValues,
};

export type PaymentMethodForm = z.infer<typeof schema>;
