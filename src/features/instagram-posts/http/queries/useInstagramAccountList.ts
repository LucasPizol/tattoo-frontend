import { api } from "@/services/api";
import type { InstagramAccount } from "../../types";
import { useQuery } from "@tanstack/react-query";

export const useInstagramAccountList = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["instagram-accounts"],
    queryFn: () => api.get<{ instagramAccounts: InstagramAccount[] }>("/api/instagram/accounts"),
  });

  return {
    accounts: data?.instagramAccounts ?? [],
    isLoading,
    error,
  };
};
