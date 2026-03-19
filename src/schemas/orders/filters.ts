import { z } from "zod";

export const schema = z.object({
  search: z.string().optional(),
  status_in: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      }),
    )
    .optional(),
  paid_at_gteq: z.string().optional(),
  paid_at_lteq: z.string().optional(),
  client_id_eq: z.number().optional(),
  created_at_gteq: z.string().optional(),
  created_at_lteq: z.string().optional(),
});

export type OrdersFilters = z.infer<typeof schema>;

const defaultValues: OrdersFilters = {
  search: "",
  status_in: [],
  paid_at_gteq: "",
  paid_at_lteq: "",
  client_id_eq: undefined,
  created_at_gteq: "",
  created_at_lteq: "",
};

export const OrdersFiltersSchema = {
  schema,
  defaultValues,
};
