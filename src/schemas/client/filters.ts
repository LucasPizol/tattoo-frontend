import { z } from "zod";

export const schema = z.object({
  name_or_email_or_phone_cont: z.string().optional(),
  cpf_matches: z
    .string()
    .transform((value) => value?.replace(/[^\d]/g, ""))
    .optional(),
  birthday_month_eq: z.string().optional(),
});

export type ClientFilters = z.infer<typeof schema>;

export const defaultValues: ClientFilters = {
  name_or_email_or_phone_cont: "",
  cpf_matches: "",
  birthday_month_eq: "",
};

export const ClientFiltersSchema = {
  schema,
  defaultValues,
};
