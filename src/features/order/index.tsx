import { PageWrapper } from "@/components/PageWrapper";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { OrderEdit } from "./components/OrderEdit";
import { OrderSkeleton } from "./components/OrderSkeleton";
import { OrderView } from "./components/OrderView";
import { useOrder } from "./hooks/useOrder";
import styles from "./styles.module.scss";

export type Part = {
  userId: number;
  valueExpected: number;
  valueReceived: number;
  paymentMethodId: number | null;
};

export const Order = () => {
  const navigate = useNavigate();
  const orderData = useOrder();

  const isViewOnly = useMemo(() => {
    return orderData.order?.createdBy === "client";
  }, [orderData.order?.createdBy]);

  return (
    <PageWrapper
      onBack={() => {
        if (window.history.state.idx > 0) {
          navigate(-1);
        } else {
          navigate(
            `/pedidos/${
              orderData.order?.createdBy === "client" ? "clientes" : "usuarios"
            }`
          );
        }
      }}
      title={
        orderData.order?.id ? `Pedido #${orderData.order.id}` : `Carregando...`
      }
      actions={undefined}
      className={styles.container}
    >
      {orderData.isLoading && !orderData.order ? (
        <OrderSkeleton />
      ) : (
        orderData.order && (
          <>
            {isViewOnly ? (
              <OrderView
                order={orderData.order}
                isLoading={orderData.isLoading}
              />
            ) : (
              <OrderEdit {...orderData} />
            )}
          </>
        )
      )}
    </PageWrapper>
  );
};
