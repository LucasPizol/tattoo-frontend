type Config = {
  productPercentageVariation: number;
};

export type UserRole = { id: number; name: string };

export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  role: UserRole | null;
  permissions: string[];
  config: Config;
  has_pending_contract: boolean;
};
