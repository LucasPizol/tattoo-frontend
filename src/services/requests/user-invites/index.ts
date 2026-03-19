import { api } from "@/services/api";
import type { UserInvite } from "./types";

const index = async () => {
  const response = await api.get<{ userInvites: UserInvite[] }>(
    "/api/user_invites",
  );
  return response.userInvites;
};

const create = async (phone: string, role: number, commission_percentage: number) => {
  const response = await api.post<{ message: string }>("/api/user_invites", {
    phone,
    role,
    commission_percentage,
  });
  return response.message;
};

const resend = async (id: number) => {
  const response = await api.post<{ message: string }>(
    `/api/user_invites/${id}/resend`,
  );
  return response.message;
};

const accept = async (token: string, password: string, name: string) => {
  const response = await api.post<{ message: string }>(
    `/api/user_invites/accept`,
    { password, name },
    {
      headers: {
        "X-Invite-Token": token,
        "Content-Type": "application/json",
      },
    },
  );
  return response.message;
};

export const UserInviteRequests = {
  index,
  create,
  resend,
  accept,
};
