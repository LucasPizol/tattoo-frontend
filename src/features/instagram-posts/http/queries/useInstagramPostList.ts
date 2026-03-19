import { api } from "@/services/api";
import type { PaginationResponse } from "@/models/Pagination";
import type { InstagramPost } from "../../types";
import { useQueryPagination } from "../../../../hooks/useQueryPagination";

export const useInstagramPostList = () => {
  const { data, isLoading, error, refetch, pagination } = useQueryPagination({
    queryKey: ["instagram-posts"],
    queryFn: (pagination) => api.get<PaginationResponse<InstagramPost>>("/api/instagram/posts", pagination),
  });

  return {
    posts: data,
    isLoading,
    error,
    refetch,
    pagination,
  };
};
