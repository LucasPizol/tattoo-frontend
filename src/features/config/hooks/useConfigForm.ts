import { UserConfigSchema, type UserConfigForm } from "@/schemas/user-config";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export const useConfigForm = () => {
  return useForm<UserConfigForm>({
    resolver: zodResolver(UserConfigSchema.schema),
    defaultValues: UserConfigSchema.defaultValues,
  });
};
