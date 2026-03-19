export type CreateInstagramPostPayload = {
  caption: string;
  contents: File[];
  instagramAccountIds: string[];
};

type Statuses = "draft" | "publishing" | "published" | "failed";

export type InstagramPost = {
  id: number;
  caption: string;
  url: string;
  permalink: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  status: Statuses;
  errorMessage?: string;
  likeCount: number | null;
  commentsCount: number | null;
  viewCount: number | null;
  contents: {
    url: string;
    thumbnailUrl: string;
    id: number;
  }[];
  account: {
    id: number;
    username: string;
    profilePictureUrl: string;
  };
};

export type InstagramPostResponse = {
  instagramPost: InstagramPost;
};

export type InstagramAccount = {
  id: number;
  username: string;
  profilePictureUrl: string;
  createdAt: string;
  updatedAt: string;
};
