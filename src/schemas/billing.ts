import { z } from "zod";

import type { BillingState } from "@/services/requests/billing/types";

const BILLING_STATE_VALUES = [
  "no_subscription",
  "trialing",
  "active",
  "past_due",
  "incomplete",
  "canceled",
] as const satisfies readonly BillingState[];

/**
 * Mirrors the backend `Billing::DeriveStateService` enum. We `.catch`
 * unknown values back to `"no_subscription"` to fail closed (same
 * default-deny posture the backend uses in
 * `derive_state_service.rb#call`).
 */
const billingStateSchema = z
  .enum(BILLING_STATE_VALUES)
  .catch("no_subscription");

export const billingStatusSchema = z.object({
  has_active_subscription: z.boolean(),
  status: z
    .enum([
      "trialing",
      "active",
      "past_due",
      "unpaid",
      "canceled",
      "incomplete",
    ])
    .nullable(),
  billing_state: billingStateSchema,
  plan_lookup_key: z.string().nullable(),
  current_period_end: z.string().nullable(),
  trial_end: z.string().nullable(),
  cancel_at_period_end: z.boolean().nullable(),
});

export type BillingStatus = z.infer<typeof billingStatusSchema>;

export type BillingSubscriptionStatus = NonNullable<BillingStatus["status"]>;
