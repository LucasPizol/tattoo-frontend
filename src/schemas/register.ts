import { z } from "zod";

export const FOCUS_OPTIONS = [
  { value: "tattoo", label: "Tatuagem" },
  { value: "piercing", label: "Piercing" },
  { value: "both", label: "Ambos" },
] as const;

export type FocusValue = (typeof FOCUS_OPTIONS)[number]["value"];

const companyStep = z.object({
  company_name: z.string().min(1, "Nome da empresa é obrigatório"),
  cnpj: z.string().min(18, "CNPJ inválido"),
  focus: z.enum(["tattoo", "piercing", "both"]),
});

const userStep = z.object({
  full_name: z.string().min(1, "Nome completo é obrigatório"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(8, "Mínimo de 8 caracteres"),
});

const schema = companyStep.merge(userStep);

const defaultValues: RegisterForm = {
  company_name: "",
  cnpj: "",
  focus: "both",
  full_name: "",
  email: "",
  password: "",
};

export type RegisterForm = z.infer<typeof schema>;

export const RegisterSchema = {
  schema,
  defaultValues,
  companyStep,
  userStep,
};
