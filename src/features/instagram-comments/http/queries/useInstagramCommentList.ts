import { api } from "@/services/api";
import type { PaginationResponse } from "@/models/Pagination";
import type { InstagramComment } from "@/features/instagram-comments/types";
import { useQueryPagination } from "../../../../hooks/useQueryPagination";

export const useInstagramCommentList = () => {
  const { data, isLoading, error, refetch, pagination } = useQueryPagination({
    queryKey: ["instagram-comments"],
    queryFn: (pagination) =>
      api.get<PaginationResponse<InstagramComment>>(
        "/api/instagram/comments",
        pagination
      ),
  });

  return {
    comments: data,
    isLoading,
    error,
    refetch,
    pagination,
  };
};
