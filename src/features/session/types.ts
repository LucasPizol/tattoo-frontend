import type { User } from "@/models/User";

export type LoginPayload = {
  username: string;
  password: string;
};

export type CompanyEntitlements = {
  multi_artist_commissions: boolean;
  instagram_raffles: boolean;
  whatsapp_messaging: boolean;
  ai_sales_report: boolean;
};

export type LoginResponse = {
  user: Pick<User, "role" | "name" | "permissions" | "config" | "has_pending_contract">;
  company: {
    onboarding_completed_at: string | null;
    onboarding_steps: {
      whatsapp: boolean;
      first_client: boolean;
      first_order: boolean;
      instagram: boolean;
      team: boolean;
    };
    entitlements: CompanyEntitlements;
  };
};
