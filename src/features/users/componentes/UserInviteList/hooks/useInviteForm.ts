import { InviteFormSchema, type InviteForm } from "../schema";
import { useInviteUser } from "@/features/users/http/mutations/useInviteUser";
import { useModal } from "@/components/ui/Modal/useModal";
import type { UserInvite } from "@/services/requests/user-invites/types";

export const useInviteForm = () => {
  const { open, close, modalProps } = useModal<InviteForm, UserInvite>({
    onSubmit: async (data) => {
      await onSubmit(data);
    },
    initialValues: {
      phone: "",
      role: undefined,
      commission_percentage: 0,
    },
    schema: InviteFormSchema,
  });

  const { mutateAsync: inviteUser } = useInviteUser();

  const onSubmit = async (data: InviteForm) => {
    if (!data.role) return;

    await inviteUser({ phone: data.phone, role: data.role, commission_percentage: data.commission_percentage });
  };

  return {
    open,
    close,
    modalProps,
    onSubmit,
  };
};
