export type UserInvite = {
  id: number;
  phone: string;
  status: "pending" | "accepted" | "rejected";
  commission_percentage: number;
};
