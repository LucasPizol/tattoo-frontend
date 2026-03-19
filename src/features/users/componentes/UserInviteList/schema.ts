import z from "zod";

export const InviteFormSchema = z
  .object({
    phone: z.string().min(1, { message: "Telefone é obrigatório" }),
    role: z.number().optional(),
    commission_percentage: z.coerce.number().min(0).max(100),
  })
  .refine((data) => data.role !== undefined, {
    message: "Cargo é obrigatório",
    path: ["role"],
  });

export type InviteForm = z.infer<typeof InviteFormSchema>;
