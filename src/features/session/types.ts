import type { User } from "@/models/User";

export type LoginPayload = {
  username: string;
  password: string;
};

export type LoginResponse = {
  user: Pick<User, "role" | "name" | "permissions" | "config" | "has_pending_contract">;
};
