import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import type { Tag } from "../../types";

export const useTagListQuery = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["tags"],
    queryFn: () => api.get<{ tags: Tag[] }>("/api/tags"),
    staleTime: 5 * 60 * 1000,
  });

  return {
    data: data?.tags.sort((a, b) => b.children.length - a.children.length) || [],
    isLoading,
    refetch,
  };
};
