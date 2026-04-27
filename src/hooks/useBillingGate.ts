import { useQuery } from "@tanstack/react-query";

import { BILLING_STATUS_QUERY_KEY } from "@/features/config/components/SubscriptionCard/useSubscription";
import {
  type BillingState,
  billingService,
} from "@/services/requests/billing";

export type AccessBucket = "allow" | "soft_block" | "hard_block";

export type UseBillingGateResult = {
  billingState: BillingState | null;
  isLoading: boolean;
  accessBucket: AccessBucket;
};

const HARD_BLOCK_STATES: ReadonlySet<BillingState> = new Set<BillingState>([
  "no_subscription",
  "canceled",
]);

const SOFT_BLOCK_STATES: ReadonlySet<BillingState> = new Set<BillingState>([
  "past_due",
]);

/**
 * Maps a `billing_state` value to the access bucket the routing layer
 * should enforce. Mirrors the backend buckets defined in
 * `Billing::DeriveStateService` (HARD_BLOCK / SOFT_BLOCK / ALLOW).
 *
 * Defensive default: `null` (loading or no data yet) returns `"allow"`
 * so we never flicker users into a hard-block redirect while the
 * status query is in flight. The routing layer handles the real
 * loading state via `isLoading`.
 */
const computeAccessBucket = (state: BillingState | null): AccessBucket => {
  if (state === null) return "allow";
  if (HARD_BLOCK_STATES.has(state)) return "hard_block";
  if (SOFT_BLOCK_STATES.has(state)) return "soft_block";
  return "allow";
};

/**
 * Thin wrapper around the existing billing-status query. Single
 * source of truth for the WI#5 frontend gate. Re-uses the shared
 * `BILLING_STATUS_QUERY_KEY` so cache hits/invalidations from the
 * SubscriptionCard automatically propagate here.
 */
export const useBillingGate = (): UseBillingGateResult => {
  const query = useQuery({
    queryKey: BILLING_STATUS_QUERY_KEY,
    queryFn: billingService.getBillingStatus,
  });

  const billingState = query.data?.billing_state ?? null;

  return {
    billingState,
    isLoading: query.isLoading,
    accessBucket: computeAccessBucket(billingState),
  };
};
