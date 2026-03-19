import { Button } from "@/components/ui/Button";
import { Table } from "@/components/ui/Table";
import { useUserInviteList } from "@/features/users/http/queries/useUserInviteList";
import { useResendInvite } from "@/features/users/http/mutations/useResendInvite";
import { MdRefresh } from "react-icons/md";
import type { UserInvite } from "@/services/requests/user-invites/types";

export const UserInviteList = () => {
  const { userInvites = [], isLoading } = useUserInviteList();

  const { mutateAsync: resendInvite } = useResendInvite();

  const columns = [
    {
      key: "phone",
      label: "Telefone",
    },
    {
      key: "status",
      label: "Status",
    },
    {
      key: "commission_percentage",
      label: "Comissão (%)",
    },
    {
      key: "actions",
      label: "Ações",
      render: (row: UserInvite) => {
        return (
          <Button
            variant="tertiary"
            onClick={() => resendInvite(row.id)}
            prefixIcon={<MdRefresh size={20} />}
          >
            Reenviar Convite
          </Button>
        );
      },
    },
  ];

  return <Table columns={columns} data={userInvites} loading={isLoading} />;
};
