export type UserRole = {
  id: number;
  name: string;
};

export type User = {
  id: number;
  name: string;
  role: UserRole | null;
  commission_percentage: number;
  contract: { id: number; status: "pending" | "signed" } | null;
};

export type UserInvite = {
  id: number;
  phone: string;
  createdAt: string;
  status: "pending" | "accepted" | "rejected";
  commission_percentage: number;
  role: { id: number; name: string } | null;
};
