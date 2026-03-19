import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  description: z.string().optional(),
  primary_count: z.coerce
    .number()
    .min(1, { message: "Mínimo 1 ganhador principal" }),
  secondary_count: z.coerce.number().min(0),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  product_ids: z.array(z.number()).optional(),
  min_order_value: z.coerce.string().min(0).optional(),
  instagram_post_id: z.number().optional(),
});

const defaultValues: RaffleFormData = {
  name: "",
  description: "",
  primary_count: 1,
  secondary_count: 0,
  start_date: undefined,
  end_date: undefined,
  product_ids: undefined,
  min_order_value: "",
};

export type RaffleFormData = z.infer<typeof schema>;

export const RaffleSchema = {
  schema,
  defaultValues,
};
