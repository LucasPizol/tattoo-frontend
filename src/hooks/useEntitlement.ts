import { useSessionContext } from "@/context/useSession";
import type { CompanyEntitlements } from "@/features/session/types";

export const useEntitlement = (key: keyof CompanyEntitlements): boolean => {
  const { session } = useSessionContext();

  if (!session.isAuthenticated) return false;

  const entitlements = session.company?.entitlements;
  if (!entitlements) return false;

  return entitlements[key] === true;
};
