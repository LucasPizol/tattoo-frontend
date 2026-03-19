import z from "zod";

const schema = z.object({
  quantity: z.number(),
  value: z.string(),
});

const defaultValues = {
  quantity: 0,
  value: "",
};

export const OrderProductSchema = {
  schema,
  defaultValues,
};
