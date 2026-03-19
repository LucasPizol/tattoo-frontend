import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Visible } from "@/components/Visible";
import { useSessionContext } from "@/context/useSession";
import { ApplyBirthDateDiscountRequests } from "@/services/requests/orders/apply-birth-date-discount";
import { OrderStatus } from "@/services/requests/orders/types";
import { useCallback } from "react";
import { useOrder } from "../../hooks/useOrder";
import styles from "./styles.module.scss";

export const ApplyBirthDateDiscountAlert = () => {
  const { order, refetch } = useOrder();
  const { session } = useSessionContext();

  const handleApplyBirthDateDiscount = useCallback(async () => {
    if (!order) return;

    await ApplyBirthDateDiscountRequests.apply(order.id);
    await refetch();
  }, [order, refetch]);

  if (!order?.canApplyBirthDateDiscount || !session?.user) {
    return null;
  }

  const config = session?.user?.config;

  if (order?.appliedBirthDateDiscountPercentage === 0) {
    if (order?.status === OrderStatus.PAID) {
      return null;
    }
    return (
      <Alert type="info" className={styles.alert}>
        <div className={styles.alertContent}>
          <p>
            O cliente faz aniversário em {order.client?.birthDate}. Você pode
            aplicar um desconto de {config.birthDateDiscountPercentage}%
          </p>
          <Button onClick={handleApplyBirthDateDiscount}>
            Aplicar desconto
          </Button>
        </div>
      </Alert>
    );
  }

  return (
    <Alert type="success" className={styles.alert}>
      <div className={styles.alertContent}>
        <p>
          O desconto de aniversário de{" "}
          {order.appliedBirthDateDiscountPercentage}% foi aplicado
        </p>

        <Visible condition={order?.status !== OrderStatus.PAID}>
          <Button onClick={handleApplyBirthDateDiscount} danger>
            Remover desconto
          </Button>
        </Visible>
      </div>
    </Alert>
  );
};
