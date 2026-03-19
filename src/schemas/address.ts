import { z } from "zod";

const schema = z.object({
  addressId: z.number().optional(),
  street: z.string().optional(),
  number: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  complement: z.string().optional(),
});

const defaultValues: AddressForm = {
  addressId: undefined,
  street: "",
  number: "",
  neighborhood: "",
  city: "",
  state: "",
  zipCode: "",
  complement: "",
};

export const AddressSchema = {
  schema,
  defaultValues,
};

export type AddressForm = z.infer<typeof schema>;
