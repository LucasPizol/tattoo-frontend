import { api } from "@/services/api";
import type { UserInvite } from "../../types";
import { useQuery } from "@tanstack/react-query";

export const useUserInviteList = ({
  disabled = false,
}: { disabled?: boolean } = {}) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["user-invites"],
    queryFn: async () => {
      const response = await api.get<{ userInvites: UserInvite[] }>("/api/user_invites");
      return response.userInvites;
    },
    enabled: !disabled,
  });

  return { userInvites: data, isLoading, refetch };
};
