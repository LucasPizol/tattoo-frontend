export type CheckoutErrorCode =
  | "already_subscribed"
  | "price_unavailable"
  | "stripe_unavailable"
  | "unknown";

export type PortalErrorCode =
  | "no_billing_account"
  | "stripe_unavailable"
  | "unknown";
