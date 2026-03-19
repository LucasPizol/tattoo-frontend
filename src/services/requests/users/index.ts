import { api } from "@/services/api";
import type { User } from "./types";

const index = async () => {
  const response = await api.get<{ users: User[] }>("/api/users");
  return response.users;
};

const update = async (id: number, data: { commission_percentage: number; role_id: number | null }) => {
  const response = await api.put<{ message: string }>(`/api/users/${id}`, data);
  return response.message;
};

export const UserRequests = {
  index,
  update,
};
