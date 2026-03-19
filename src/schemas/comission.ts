import z from "zod";

const schema = z
  .object({
    name: z
      .string({ message: "Nome é obrigatório" })
      .min(1, { message: "Nome é obrigatório" }),
    percentage: z
      .number()
      .min(0, { message: "Percentual deve ser maior ou igual a 0" })
      .max(100, { message: "Percentual deve ser menor ou igual a 100" })
      .optional(),
    value: z
      .string({ message: "Valor é obrigatório" })
      .min(1, { message: "Valor é obrigatório" })
      .optional(),
  })
  .refine(
    (data) => {
      const hasPercentage =
        data.percentage !== undefined && data.percentage > 0;
      const hasValue =
        data.value !== undefined &&
        data.value !== "" &&
        data.value !== "R$ 0,00";
      return hasPercentage || hasValue;
    },
    {
      message: "Informe o percentual ou o valor da comissão",
      path: ["percentage"],
    }
  );

export const ComissionSchema = {
  schema,
  defaultValues: {
    name: "",
    percentage: 0,
    value: "R$ 0,00",
  },
};

export type ComissionForm = z.infer<typeof schema>;
