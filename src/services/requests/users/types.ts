export type User = {
  id: number;
  name: string;
  role: { id: number; name: string } | null;
  commission_percentage: number;
  contract: { id: number; status: "pending" | "signed" } | null;
};
