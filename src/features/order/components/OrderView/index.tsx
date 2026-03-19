import { Divider } from "@/components/ui/Divider";
import { ImagePreview } from "@/components/ui/ImageUpload/ImagePreview";
import { ImagePreviewList } from "@/components/ui/ImageUpload/ImagePreviewList";
import { Table } from "@/components/ui/Table";
import { Tag } from "@/components/ui/Tag";
import { Visible } from "@/components/Visible";
import type { OrderProduct } from "@/services/requests/order-products/types";
import {
  OrderStatus,
  type OrderShowResponse,
} from "@/services/requests/orders/types";
import { masks } from "@/utils/masks";
import { useMemo } from "react";
import {
  MdAttachMoney,
  MdCalendarToday,
  MdEmail,
  MdPerson,
  MdPhone,
  MdShoppingCart,
} from "react-icons/md";
import { useAttachedImages } from "../../hooks/useAttachedImages";
import styles from "./styles.module.scss";

type OrderViewProps = {
  order: OrderShowResponse["order"];
  isLoading?: boolean;
};

export const OrderView = ({ order, isLoading }: OrderViewProps) => {
  const { data: attachedImages } = useAttachedImages(order.id);

  const orderProducts = useMemo(() => {
    return order?.orderProducts || [];
  }, [order]);

  const columns = useMemo(
    () => [
      {
        key: "images",
        label: " ",
        maxWidth: "70px",
        padding: "8px 0px",
        render: (orderProduct: OrderProduct) => {
          return (
            <ImagePreview
              images={orderProduct.stock.product.images.map((image) => ({
                url: image.url,
                id: image.id,
                thumbnailUrl: image.thumbnailUrl,
              }))}
              rounded
              className={styles.image}
              clickable
              maxHeight={"70px"}
              maxWidth={"70px"}
            />
          );
        },
        align: "center" as const,
      },
      {
        key: "product",
        label: "Produto",
        render: (orderProduct: OrderProduct) => (
          <div className={styles.productInfo}>
            <strong>{orderProduct.stock.product.name}</strong>
            <span className={styles.material}>
              {orderProduct.stock.user.name}
            </span>
            <span className={styles.material}>
              {orderProduct.stock.product.material.name} -{" "}
              {orderProduct.stock.product.productType.label}
            </span>
          </div>
        ),
      },
      {
        key: "quantity",
        label: "Qtd",
        render: (orderProduct: OrderProduct) => (
          <span className={styles.value}>{orderProduct.quantity}</span>
        ),
        align: "center" as const,
      },
      {
        key: "value",
        label: "Valor",
        render: (orderProduct: OrderProduct) => (
          <span className={styles.value}>{orderProduct.value.formatted}</span>
        ),
        align: "center" as const,
      },
      {
        key: "total",
        label: "Total",
        render: (orderProduct: OrderProduct) => (
          <span className={styles.totalValue}>
            {masks.formatCurrency(
              (orderProduct.quantity * orderProduct.value.value).toString()
            )}
          </span>
        ),
        align: "center" as const,
      },
    ],
    []
  );

  return (
    <>
      <div className={styles.viewBadge}>
        <span>Modo Visualização</span>
      </div>

      <div className={styles.layout}>
        {/* Informações do Cliente */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <MdPerson size={18} />
              <span>Cliente</span>
            </div>
          </div>

          <Visible condition={!!order?.client}>
            <div className={styles.clientCard}>
              <div className={styles.clientInfo}>
                <strong className={styles.clientName}>
                  {order?.client?.name}
                </strong>
                <div className={styles.clientDetails}>
                  <Visible condition={!!order?.client?.phone}>
                    <span className={styles.clientDetail}>
                      <MdPhone size={14} />
                      {masks.formatPhone(order?.client?.phone ?? "")}
                    </span>
                  </Visible>
                  <Visible condition={!!order?.client?.email}>
                    <span className={styles.clientDetail}>
                      <MdEmail size={14} />
                      {order?.client?.email}
                    </span>
                  </Visible>
                </div>
              </div>
            </div>
          </Visible>

          <Visible condition={!order?.client}>
            <div className={styles.emptyState}>
              <span>Nenhum cliente vinculado</span>
            </div>
          </Visible>
        </section>

        <Divider style={{ margin: 0 }} />

        {/* Resumo do Pagamento */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <MdAttachMoney size={18} />
              <span>Resumo</span>
            </div>
            <Tag color={order?.status === OrderStatus.PAID ? "green" : "blue"}>
              {order?.status === OrderStatus.PAID ? "Pago" : "Pendente"}
            </Tag>
          </div>

          <div className={styles.summaryCard}>
            {order?.clientPayments.map((payment) => (
              <div className={styles.summaryDetails}>
                <div className={styles.summaryLine}>
                  <span>Método de pagamento</span>
                  <span>{payment.paymentMethod.name}</span>
                </div>
                <div className={styles.summaryLine}>
                  <span>Total pago pelo cliente</span>
                  <span>{payment.totalPaidAmount.formatted ?? "R$ 0,00"}</span>
                </div>
                <div className={styles.summaryLine}>
                  <span>Parcelas</span>
                  <span>{payment.installments}</span>
                </div>
                {payment.installments > 1 && (
                  <>
                    <div className={styles.summaryLine}>
                      <span>Valor da parcela</span>
                      <span>
                        {payment.installmentAmount.formatted ?? "R$ 0,00"}
                      </span>
                    </div>
                  </>
                )}
                <Divider text="Subtotal" style={{ margin: 0 }} />
                <div className={styles.summaryLine}>
                  <span>Total recebido</span>
                  <span>{payment.netReceivedValue.formatted ?? "R$ 0,00"}</span>
                </div>
                <div className={styles.summaryLine}>
                  <span>Frete</span>
                  <span>{order?.shippingValue.formatted ?? "R$ 0,00"}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Divider style={{ margin: 0 }} />

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <MdAttachMoney size={18} />
              <span>Pagamentos aos vendedores</span>
            </div>
          </div>

          <Visible condition={order?.payments.length > 0}>
            <div className={styles.summaryCard}>
              <div className={styles.summaryDetails}>
                {order?.payments
                  .filter(
                    (payment) =>
                      payment.valueExpected.value > 0 ||
                      payment.valueReceived.value > 0
                  )
                  .map((payment) => (
                    <>
                      <Divider
                        style={{ margin: 0 }}
                        text={payment.name}
                        textColor="#888"
                        textAlign="left"
                      />
                      <div className={styles.summaryLine}>
                        <span>Total recebido</span>
                        <span>
                          {payment.valueReceived.formatted ?? "R$ 0,00"}
                        </span>
                      </div>
                      {/* <div className={styles.summaryLine}>
                        <span>Total pago por frete</span>
                        <span>
                          {payment.shipmentReceivedValue.formatted ?? "R$ 0,00"}
                        </span>
                      </div> */}
                      {payment.valueExpected.value > 0 &&
                        payment.valueReceived.value !==
                        payment.valueExpected.value && (
                          <div className={styles.summaryLine}>
                            <span>Total esperado</span>
                            <span>
                              {payment.valueExpected.formatted ?? "R$ 0,00"}
                            </span>
                          </div>
                        )}
                    </>
                  ))}
              </div>
            </div>
          </Visible>
        </section>

        {/* Produtos */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <MdShoppingCart size={18} />
              <span>Produtos ({orderProducts.length})</span>
            </div>
          </div>

          {orderProducts.length === 0 && !isLoading ? (
            <div className={styles.emptyState}>
              <span>Nenhum produto adicionado</span>
            </div>
          ) : (
            <div className={styles.productsTable}>
              <Table
                columns={columns}
                data={orderProducts}
                loading={isLoading}
                className={styles.table}
              />
            </div>
          )}
        </section>

        {/* Anexos */}
        <Visible
          condition={
            !!attachedImages &&
            attachedImages.orderImages &&
            attachedImages.orderImages.length > 0
          }
        >
          <Divider style={{ margin: 0 }} />

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitle}>
                <MdCalendarToday size={18} />
                <span>Anexos</span>
              </div>
            </div>

            <ImagePreviewList
              previews={
                attachedImages?.orderImages.map((image) => ({
                  id: image.id,
                  url: image.url,
                  thumbnailUrl: image.thumbnailUrl,
                })) || []
              }
              onRemove={() => { }}
            />
          </section>
        </Visible>

        {/* Data de criação */}
        <Divider style={{ margin: 0 }} />

        <section className={styles.section}>
          <div className={styles.dateInfo}>
            <span>
              Criado em:{" "}
              <strong>{masks.formatDate(order?.createdAt ?? "")}</strong>
            </span>
            <span>
              Atualizado em:{" "}
              <strong>{masks.formatDate(order?.updatedAt ?? "")}</strong>
            </span>
          </div>
        </section>
      </div>
    </>
  );
};
