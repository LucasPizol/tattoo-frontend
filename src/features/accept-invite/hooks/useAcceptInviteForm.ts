import { useForm } from "react-hook-form";
import { AcceptInviteSchema, type AcceptInviteForm } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAcceptInvite } from "@/features/accept-invite/http/mutations/acceptInviteMutations";

export const useAcceptInviteForm = () => {
  const { mutateAsync: acceptInvite } = useAcceptInvite();

  const form = useForm<AcceptInviteForm>({
    resolver: zodResolver(AcceptInviteSchema),
    defaultValues: {
      password: "",
      name: "",
    },
  });

  const onSubmit = async (data: AcceptInviteForm) => {
    await acceptInvite(data);
  };

  return {
    form,
    onSubmit,
  };
};
