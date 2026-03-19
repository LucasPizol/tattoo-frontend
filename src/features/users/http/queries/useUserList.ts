import { api } from "@/services/api";
import type { User } from "../../types";
import { useQuery } from "@tanstack/react-query";

export const useUserList = ({
  disabled = false,
}: { disabled?: boolean } = {}) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await api.get<{ users: User[] }>("/api/users");
      return response.users;
    },
    enabled: !disabled,
  });

  return { users: data, isLoading, refetch };
};
