import type { Pagination, PaginationResponse } from "@/models/Pagination";
import { api } from "@/services/api";
import type { InstagramComment } from "./types";

export const InstagramCommentsRequests = {
  index: (pagination: Pagination) =>
    api.get<PaginationResponse<InstagramComment>>(
      "/api/instagram/comments",
      pagination
    ),
};
