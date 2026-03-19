import { api } from "@/services/api";
import type { InstagramPostResponse } from "../../types";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export const useInstagramPost = () => {
  const { id } = useParams<{ id: string }>();

  const { data: post, isLoading } = useQuery({
    queryKey: ["instagram-post", id],
    queryFn: () => api.get<InstagramPostResponse>(`/api/instagram/posts/${Number(id)}`),
    enabled: !!id,
  });

  return { post: post?.instagramPost, isLoading };
};
