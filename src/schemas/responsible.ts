import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, { message: "Nome do responsável é obrigatório" }),
  cpf: z.string().min(1, { message: "CPF do responsável é obrigatório" }),
  rg: z.string().optional(),
  birthDate: z
    .string()
    .min(1, { message: "Data de nascimento do responsável é obrigatória" }),
  gender: z.string().min(1, { message: "Gênero do responsável é obrigatório" }),
  email: z.email().optional(),
  phone: z
    .string()
    .min(1, { message: "Telefone do responsável é obrigatório" }),
});

const defaultValues: ResponsibleForm = {
  name: "",
  cpf: "",
  rg: undefined,
  birthDate: "",
  gender: "",
  email: "",
  phone: "",
};

export type ResponsibleForm = z.infer<typeof schema>;

export const ResponsibleSchema = {
  schema,
  defaultValues,
};
