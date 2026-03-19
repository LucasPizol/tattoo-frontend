import type { Pagination, PaginationResponse } from "@/models/Pagination";
import { api } from "@/services/api";
import type {
  CreateInstagramPostPayload,
  InstagramPost,
  InstagramPostResponse,
} from "./types";

export const InstagramPostsRequests = {
  index: (pagination: Pagination) =>
    api.get<PaginationResponse<InstagramPost>>(
      "/api/instagram/posts",
      pagination
    ),
  show: (id: number) =>
    api.get<InstagramPostResponse>(`/api/instagram/posts/${id}`),
  destroy: (id: number) => api.delete<void>(`/api/instagram/posts/${id}`),
  create: (payload: CreateInstagramPostPayload) => {
    const formData = new FormData();

    payload.contents.forEach((content) => {
      formData.append("post[contents][]", content);
    });
    formData.append("post[caption]", payload.caption);

    payload.instagramAccountIds.forEach((id) => {
      formData.append("post[instagram_account_ids][]", id.toString());
    });

    return api.post<InstagramPost>("/api/instagram/posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  update: (id: number, payload: CreateInstagramPostPayload) => {
    const formData = new FormData();

    payload.contents.forEach((content) => {
      formData.append("post[contents][]", content);
    });
    formData.append("post[caption]", payload.caption);

    return api.put<InstagramPost>(`/api/instagram/posts/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  publish: (id: number) =>
    api.post<InstagramPost>(`/api/instagram/posts/${id}/publish`),
  generateContent: (
    id: number,
    payload: { caption: string; contents: File[] }
  ) => {
    const formData = new FormData();
    formData.append("instagram_post[caption]", payload.caption);
    payload.contents.forEach((content) => {
      formData.append("instagram_post[contents][]", content);
    });

    return api.post<{ content: string }>(
      `/api/instagram/posts/${id}/generate_content`,
      formData
    );
  },
};
