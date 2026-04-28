import { RegisterSchema, type RegisterForm } from "@/schemas/register";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRegister } from "../http/mutations/registerMutation";

const ACCOUNT_FIELDS: (keyof RegisterForm)[] = [
  "company_name",
  "cnpj",
  "focus",
  "full_name",
  "email",
  "password",
];

export const useRegisterForm = () => {
  const [step, setStep] = useState(0);
  const [selectedLookupKey, setSelectedLookupKey] = useState<string | null>(null);
  const { mutateAsync: register } = useRegister();

  const form = useForm<RegisterForm>({
    resolver: zodResolver(RegisterSchema.schema),
    defaultValues: RegisterSchema.defaultValues,
    mode: "onTouched",
  });

  const selectPlan = (lookupKey: string) => {
    setSelectedLookupKey(lookupKey);
    setStep(1);
  };

  const nextStep = async () => {
    const valid = await form.trigger(ACCOUNT_FIELDS);
    if (!valid) return;
    await register(form.getValues());
    setStep(2);
  };

  const prevStep = () => setStep((s) => Math.max(0, s - 1));

  return { form, step, selectedLookupKey, selectPlan, nextStep, prevStep };
};
