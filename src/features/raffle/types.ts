import type { PaginationResponse } from "@/models/Pagination";

export type RaffleType = "primary" | "secondary";

export type RaffleClient = {
  id: number;
  raffleType: RaffleType;
  position: number;
  client: {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    cpf?: string;
  } | null;
  instagramComment?: {
    username: string;
    text: string;
  } | null;
};

export type RaffleFilters = {
  start_date?: string;
  end_date?: string;
  product_ids?: number[];
  min_order_value?: number;
};

export type RaffleInstagramPost = {
  id: number;
  caption: string;
  likeCount: number | null;
  commentsCount: number | null;
  publishedAt: string;
};

export type Raffle = {
  id: number;
  name: string;
  description?: string;
  primaryCount: number;
  secondaryCount: number;
  filters: RaffleFilters | null;
  instagramPostId?: number | null;
  createdAt: string;
  updatedAt: string;
};

export type RaffleDetail = Raffle & {
  clients: RaffleClient[];
  instagramPost?: RaffleInstagramPost | null;
};

export type RaffleCreatePayload = {
  name: string;
  description?: string;
  primary_count: number;
  secondary_count: number;
  filters?: RaffleFilters;
  instagram_post_id?: number;
};

export type RaffleIndexResponse = PaginationResponse<Raffle>;
export type RaffleShowResponse = RaffleDetail;
