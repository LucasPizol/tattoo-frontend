import { api } from "@/services/api";
import { useMutation } from "@tanstack/react-query";
import type { RegisterForm } from "@/schemas/register";

export const useRegister = () =>
  useMutation({
    mutationFn: (data: RegisterForm) =>
      api.post("/api/registrations", { registration: data }),
  });
