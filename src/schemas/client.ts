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
  diabetes: z.boolean().optional(),
  epilepsy: z.boolean().optional(),
  hemophilia: z.boolean().optional(),
  vitiligo: z.boolean().optional(),
  pacemaker: z.boolean().optional(),
  highBloodPressure: z.boolean().optional(),
  lowBloodPressure: z.boolean().optional(),
  diseaseInfectiousContagious: z.boolean().optional(),
  healingProblems: z.boolean().optional(),
  allergicReactions: z.boolean().optional(),
  hypersensitivityToChemicals: z.boolean().optional(),
  keloidProneness: z.boolean().optional(),
  hipoglycemia: z.boolean().optional(),
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
  diabetes: undefined,
  epilepsy: undefined,
  hemophilia: undefined,
  vitiligo: undefined,
  pacemaker: undefined,
  highBloodPressure: undefined,
  lowBloodPressure: undefined,
  diseaseInfectiousContagious: undefined,
  healingProblems: undefined,
  allergicReactions: undefined,
  hypersensitivityToChemicals: undefined,
  keloidProneness: undefined,
  hipoglycemia: undefined,
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
