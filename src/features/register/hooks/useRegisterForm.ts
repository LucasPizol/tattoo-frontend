import { RegisterSchema, type RegisterForm } from "@/schemas/register";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useRegister } from "../http/mutations/registerMutation";

const STEP_FIELDS: Record<number, (keyof RegisterForm)[]> = {
  0: ["company_name", "cnpj"],
  1: ["full_name", "email", "password"],
};

export const useRegisterForm = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const { mutateAsync: register } = useRegister();

  const form = useForm<RegisterForm>({
    resolver: zodResolver(RegisterSchema.schema),
    defaultValues: RegisterSchema.defaultValues,
    mode: "onTouched",
  });

  const nextStep = async () => {
    const valid = await form.trigger(STEP_FIELDS[0]);
    if (valid) setStep(1);
  };

  const prevStep = () => setStep(0);

  const onSubmit = async (data: RegisterForm) => {
    await register(data);
    toast.success("Conta criada com sucesso! Faça login para continuar.");
    navigate("/login");
  };

  return { form, step, nextStep, prevStep, onSubmit };
};
