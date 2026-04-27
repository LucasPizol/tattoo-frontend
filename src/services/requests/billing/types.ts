export type CheckoutErrorCode =
  | "already_subscribed"
  | "price_unavailable"
  | "stripe_unavailable"
  | "unknown";

export type PortalErrorCode =
  | "no_billing_account"
  | "stripe_unavailable"
  | "unknown";

/**
 * Canonical Rainbow billing-state enum, mirroring the backend
 * `Billing::DeriveStateService` (WI#5 brief §2.1). Six values folded
 * from the nine raw Stripe statuses. Source of truth:
 * `app/services/billing/derive_state_service.rb`.
 */
export type BillingState =
  | "no_subscription"
  | "trialing"
  | "active"
  | "past_due"
  | "incomplete"
  | "canceled";
