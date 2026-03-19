import z from "zod";

export const AcceptInviteSchema = z.object({
  password: z.string("Senha é obrigatória").min(6, {
    message: "Senha deve ter no mínimo 6 caracteres",
  }),
  name: z
    .string("Nome é obrigatório")
    .min(1, { message: "Nome é obrigatório" }),
});

export type AcceptInviteForm = z.infer<typeof AcceptInviteSchema>;
