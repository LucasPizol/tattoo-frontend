import { z } from "zod";

const schema = z.object({
  quantity: z
    .number({
      error: "Quantidade é obrigatória",
    })
    .min(0, { message: "Quantidade é obrigatória" }),
});

const defaultValues: Partial<StockMovementForm> = {};

export const StockMovementSchema = {
  schema,
  defaultValues,
};

export type StockMovementForm = z.infer<typeof schema>;
