import { useSessionContext } from "@/context/useSession";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const sessionSchema = z.object({
  username: z.string("Nome de usuário é obrigatório").min(1, {
    message: "Nome de usuário é obrigatório",
  }),
  password: z.string("Senha é obrigatória").min(6, {
    message: "Senha deve ter no mínimo 6 caracteres",
  }),
});

export type SessionFormSchema = z.infer<typeof sessionSchema>;

export const useSessionForm = () => {
  const { login } = useSessionContext();

  const form = useForm<SessionFormSchema>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: SessionFormSchema) => {
    await login({
      username: data.username,
      password: data.password,
    });
  };

  return {
    onSubmit,
    form,
  };
};
