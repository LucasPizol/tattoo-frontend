import { z } from "zod";

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
  plan_lookup_key: z.string().nullable(),
  current_period_end: z.string().nullable(),
  trial_end: z.string().nullable(),
  cancel_at_period_end: z.boolean().nullable(),
});

export type BillingStatus = z.infer<typeof billingStatusSchema>;

export type BillingSubscriptionStatus = NonNullable<BillingStatus["status"]>;
