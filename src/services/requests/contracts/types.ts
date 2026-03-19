export type ContractStatus = "pending" | "signed";

export type Contract = {
  id: number;
  content: string;
  version: number;
  status: ContractStatus;
  created_at: string;
};

export type ContractDetail = {
  id: number;
  status: ContractStatus;
  version: number;
  created_at: string;
  signed_at: string | null;
  signer_ip: string | null;
  signer_user_agent: string | null;
  signature_url: string | null;
  content: string;
  user: { id: number; name: string };
};
