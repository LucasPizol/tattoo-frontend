import z from "zod";

const formSchema = z.object({
  clientId: z.number().nullable(),
  taxesValue: z.number().min(0),
  payments: z.record(z.number(), z.string()),
});

export type OrderFormData = z.infer<typeof formSchema>;

const defaultValues: OrderFormData = {
  clientId: null,
  taxesValue: 0,
  payments: [],
};

const toPayload = (data: Partial<OrderFormData>) => ({
  client_id: data.clientId,
  taxes_value: data.taxesValue,
});

export const OrderFormSchema = {
  schema: formSchema,
  defaultValues,
  toPayload,
};
