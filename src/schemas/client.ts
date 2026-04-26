import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  email: z.string().optional(),
  phone: z.string().optional(),
  cpf: z.string().optional(),
  rg: z.string().optional(),
  birthDate: z.string().optional(),
  gender: z.string().optional().nullable(),
  maritalStatus: z.string().optional().nullable(),
  allergicReactions: z.boolean().optional(),
  healthNotes: z.string().optional().nullable(),
  instagramProfile: z.string().optional(),
  indicatedBy: z
    .object({
      id: z.number().nullable(),
      name: z.string().nullable(),
    })
    .optional(),
  observations: z.string().optional().nullable(),
});

const defaultValues: ClientForm = {
  name: "",
  email: "",
  phone: "",
  cpf: undefined,
  rg: undefined,
  birthDate: undefined,
  gender: undefined,
  maritalStatus: undefined,
  allergicReactions: undefined,
  healthNotes: undefined,
  instagramProfile: undefined,
  observations: undefined,
};

export type ClientForm = z.infer<typeof schema>;

export const ClientSchema = {
  schema,
  defaultValues,
};

const genderOptions = [
  { label: "Masculino", value: "masculino" },
  { label: "Feminino", value: "feminino" },
  { label: "Outro", value: "outro" },
];

const maritalStatusOptions = [
  { label: "Solteiro(a)", value: "solteiro" },
  { label: "Casado(a)", value: "casado" },
  { label: "Divorciado(a)", value: "divorciado" },
  { label: "Viúvo(a)", value: "viuvo" },
  { label: "União Estável", value: "uniao_estavel" },
];

export const ClientOptions = {
  genderOptions,
  maritalStatusOptions,
};
