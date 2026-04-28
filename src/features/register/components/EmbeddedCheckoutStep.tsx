import { useEffect, useRef, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { createEmbeddedCheckoutSession, CheckoutSessionError } from "@/services/requests/billing";
import toast from "react-hot-toast";
import styles from "./EmbeddedCheckoutStep.module.scss";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string);

const RETURN_URL = `${window.location.origin}/onboarding`;

interface EmbeddedCheckoutStepProps {
  priceLookupKey: string;
}

export const EmbeddedCheckoutStep = ({ priceLookupKey }: EmbeddedCheckoutStepProps) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const createdRef = useRef(false);

  useEffect(() => {
    if (createdRef.current) return;
    createdRef.current = true;

    createEmbeddedCheckoutSession(priceLookupKey, RETURN_URL)
      .then(({ client_secret }) => setClientSecret(client_secret))
      .catch((err) => {
        if (err instanceof CheckoutSessionError && err.code === "already_subscribed") {
          window.location.href = "/onboarding";
          return;
        }
        const msg =
          err instanceof CheckoutSessionError && err.code === "price_unavailable"
            ? "Plano indisponível no momento. Contate o suporte."
            : "Não foi possível iniciar o checkout. Tente novamente.";
        toast.error(msg);
        setError(msg);
      });
  }, [priceLookupKey]);

  if (error) {
    return (
      <div className={styles.errorState}>
        <p>{error}</p>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className={styles.loadingState} aria-busy="true" aria-label="Carregando checkout">
        <div className={styles.spinner} />
        <p>Preparando o checkout...</p>
      </div>
    );
  }

  return (
    <div className={styles.checkoutWrapper}>
      <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};
