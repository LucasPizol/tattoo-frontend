import { ClientSelector } from "@/components/ClientSelector";
import { ConfirmModal } from "@/components/ConfirmModal";
import { Form } from "@/components/Form";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { ImagePreview } from "@/components/ui/ImageUpload/ImagePreview";
import { ImagePreviewList } from "@/components/ui/ImageUpload/ImagePreviewList";
import { Input } from "@/components/ui/Input";
import { useModal } from "@/components/ui/Modal/useModal";
import { Popover } from "@/components/ui/Popover";
import { Select } from "@/components/ui/Select";
import { Table } from "@/components/ui/Table";
import { Tag } from "@/components/ui/Tag";
import { Visible } from "@/components/Visible";
import { usePaymentMethodList } from "@/features/payment-methods/hooks/usePaymentMethodList";
import { OrderProductsService } from "@/services/requests/order-products";
import type { OrderProduct } from "@/services/requests/order-products/types";
import { OrderRequests } from "@/services/requests/orders";
import { OrderStatus } from "@/services/requests/orders/types";
import { cn } from "@/utils/cn";
import { masks } from "@/utils/masks";
import { useCallback, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import {
  MdAdd,
  MdAttachFile,
  MdDelete,
  MdPayment,
  MdPerson,
  MdReceipt,
  MdShoppingCart,
  MdWarning,
} from "react-icons/md";
import { useParams } from "react-router-dom";
import { useAttachedImages } from "../../hooks/useAttachedImages";
import { useOrder } from "../../hooks/useOrder";
import { EditableCell } from "../EditableCell";
import { type SelectionModalProduct } from "../ProductSelectionModal";
import { LazyProductSelectionModal } from "../ProductSelectionModal/LazyProductSelectionModal";
import { ResponsibleModal } from "../ResponsibleModal";
import { ConfirmOrderContent } from "./ConfirmOrder";
import { useOrderForm } from "./hooks/useOrderForm";
import styles from "./styles.module.scss";

export type Part = {
  userId: number;
  valueExpected: number;
  valueReceived: number;
  paymentMethodId: number | null;
};

type OrderEditProps = ReturnType<typeof useOrder>;

export const OrderEdit = (props: OrderEditProps) => {
  const { id } = useParams();
  const { paymentMethods } = usePaymentMethodList();

  const {
    removeProduct,
    updateProductQuantity,
    updateProductValue,
    refetch,
    isLoading: isLoadingOrder,
    order,
  } = props;

  const {
    form,
    updateClient,
    addPaymentMethod,
    updateOrderPaymentMethod,
    removeOrderPaymentMethod,
  } = useOrderForm({
    orderId: Number(id),
    onSuccess: refetch,
  });

  const [newPaymentMethodId, setNewPaymentMethodId] = useState<number | null>(
    null,
  );
  const [newPaymentValue, setNewPaymentValue] = useState("");

  const {
    data: attachedImages,
    handleAttachImages,
    handleRemoveImage,
  } = useAttachedImages(Number(id));

  const {
    open: openProductSelectionModal,
    modalProps: productSelectionModalProps,
  } = useModal<SelectionModalProduct[]>({
    onSubmit: async (products) => {
      if (!products) return;
      await handleAddProducts(products);
    },
  });

  const isNotEditable = useMemo(() => {
    return (
      order?.status === OrderStatus.PAID ||
      order?.status === OrderStatus.WAITING_FOR_PAYMENT
    );
  }, [order]);

  const handleRemoveProduct = useCallback(
    async (orderProduct: OrderProduct) => {
      await removeProduct(orderProduct.id);
      toast.success("Produto removido do pedido");
    },
    [removeProduct],
  );

  const handleConfirmOrder = useCallback(async () => {
    try {
      await OrderRequests.update(Number(id), {
        status: OrderStatus.PAID,
      });
      toast.success("Pedido criado com sucesso!");
      refetch();
    } catch (error) {
      toast.error("Erro ao criar pedido");
    }
  }, [id, refetch]);

  const handleAddProducts = async (products: SelectionModalProduct[]) => {
    try {
      if (products.length === 0) {
        toast("Nenhum produto selecionado", { icon: <MdWarning /> });
        return;
      }

      await OrderProductsService.bulkInsert(
        products.map(({ product, stock }) => ({
          stock_id: stock!.id,
          order_id: Number(id),
          quantity: 1,
          value: product.value.value,
        })),
      );

      toast.success("Produtos adicionados com sucesso!");
      refetch();
    } catch (error) {
      toast.error("Erro ao adicionar produtos");
    }
  };

  const orderProducts = useMemo(() => {
    return order?.orderProducts || [];
  }, [order]);

  const isMinor = useMemo(() => {
    if (!order || !order.client || !order.client.birthDate) return false;
    return order.client.isLowerAge;
  }, [order]);

  const requireResponsible = useMemo(() => {
    if (!order || !order.client || !order.client.birthDate) return false;
    return (
      isMinor && orderProducts.some((op) => op.stock.product.requireResponsible)
    );
  }, [orderProducts, order, isMinor]);

  const columns = useMemo(() => {
    const baseColumns = [
      {
        key: "images",
        label: " ",
        maxWidth: "60px",
        padding: "8px 0px",
        render: (orderProduct: OrderProduct) => (
          <div className={styles.imageContainer}>
            <ImagePreview
              images={orderProduct.stock.product.images.map((image) => ({
                url: image.url,
                id: image.id,
                thumbnailUrl: image.thumbnailUrl,
              }))}
              rounded
              className={styles.image}
              clickable
              maxHeight="60px"
              maxWidth="60px"
            />
          </div>
        ),
        align: "center" as const,
      },
      {
        key: "product",
        label: "Produto",
        render: (orderProduct: OrderProduct) => {
          const stock = orderProduct.stock;
          return (
            <Popover content={stock.product.name}>
              <div className={styles.productInfo}>
                <strong>{stock.product.name}</strong>
                <span className={styles.material}>
                  {stock.product.material.name}
                  {stock.product.productType.label &&
                    ` - ${stock.product.productType.label}`}
                </span>
              </div>
            </Popover>
          );
        },
      },
      {
        key: "quantity",
        label: "Qtd",
        render: (orderProduct: OrderProduct) => {
          if (isNotEditable) {
            return (
              <span className={styles.totalValue}>{orderProduct.quantity}</span>
            );
          }
          return (
            <EditableCell
              value={orderProduct.quantity}
              renderLabel={(value) => `${value}/${orderProduct.stock.quantity}`}
              onBlur={async (value) => {
                await updateProductQuantity(orderProduct.id, Number(value));
              }}
              min={1}
              max={orderProduct.stock.quantity}
            />
          );
        },
        align: "center" as const,
      },
      {
        key: "value",
        label: "Valor",
        render: (orderProduct: OrderProduct) => {
          if (isNotEditable) {
            return (
              <span className={styles.totalValue}>
                {orderProduct.value.formatted}
              </span>
            );
          }
          return (
            <EditableCell
              value={orderProduct.value.value}
              renderLabel={(value) => {
                const isDifferent =
                  value !==
                  Number.parseInt(
                    String(orderProduct.stock.product.value.value),
                  );
                return (
                  <div className={styles.valueLabel}>
                    {masks.formatCurrency(value.toString())}
                    {isDifferent && (
                      <span className={styles.valueLabelText}>
                        Original: {orderProduct.stock.product.value.formatted}
                      </span>
                    )}
                  </div>
                );
              }}
              mask={(value) => masks.formatCurrency(value.toString())}
              onBlur={async (value) => {
                const newValue = String(value)
                  .replace("R$ ", "")
                  .replaceAll(".", "")
                  .replace(",", ".");
                await updateProductValue(orderProduct.id, Number(newValue));
              }}
            />
          );
        },
        align: "center" as const,
      },
      {
        key: "discount",
        label: "Desconto",
        render: (orderProduct: OrderProduct) => {
          const originalValue = orderProduct.stock.product.value.value;
          const currentValue = orderProduct.value.value;
          const discount =
            Number(
              (((originalValue - currentValue) / originalValue) * 100).toFixed(
                2,
              ),
            ) * -1;
          const isHigher = currentValue > originalValue;

          if (isNotEditable) {
            return (
              <span className={styles.totalValue}>
                {isHigher ? `+${discount}%` : `${discount}%`}
              </span>
            );
          }
          return (
            <EditableCell
              value={discount}
              renderLabel={(value) =>
                isHigher
                  ? `+${String(value).replace("+", "")}%`
                  : `${String(value)}%`
              }
              onBlur={async (value) => {
                let stringValue = String(value);
                let valueToUse = 0;
                const isNegative = stringValue.startsWith("-");
                if (isNegative) {
                  valueToUse = Number(stringValue.replace("-", ""));
                } else {
                  const isPositive = stringValue.startsWith("+");
                  if (isPositive) {
                    valueToUse = -Number(stringValue.replace("+", ""));
                  } else {
                    valueToUse = Number(stringValue);
                  }
                }
                const newValue = Number(
                  originalValue - (originalValue * valueToUse) / 100,
                );
                await updateProductValue(orderProduct.id, newValue / 100);
              }}
            />
          );
        },
        align: "center" as const,
      },
      {
        key: "total",
        label: "Total",
        render: (orderProduct: OrderProduct) => (
          <span className={styles.totalValue}>
            {masks.formatCurrency(
              (orderProduct.quantity * orderProduct.value.value).toString(),
            )}
          </span>
        ),
        align: "center" as const,
      },
    ];

    if (isNotEditable) return baseColumns;

    return [
      ...baseColumns,
      {
        key: "actions",
        label: " ",
        width: "auto",
        render: (orderProduct: OrderProduct) => (
          <div className={styles.actions}>
            <IconButton onClick={() => handleRemoveProduct(orderProduct)}>
              <MdDelete size={18} className={styles.actionButton} />
            </IconButton>
          </div>
        ),
        align: "center" as const,
      },
    ];
  }, [
    isNotEditable,
    updateProductQuantity,
    updateProductValue,
    handleRemoveProduct,
  ]);

  const isOrderDisabledByAge = useMemo(() => {
    return requireResponsible && !order?.client?.responsible;
  }, [requireResponsible, order?.client?.responsible]);

  const isPartsSynchronizedError = useMemo(() => {
    if (!order?.isPartsSynchronized && !isLoadingOrder) {
      return "As partes estão desatualizadas. Por favor, atualize para continuar";
    }
    return undefined;
  }, [order?.isPartsSynchronized, isLoadingOrder]);

  const hasPaymentMethod = useMemo(() => {
    return (order?.orderPaymentMethods?.length ?? 0) > 0;
  }, [order?.orderPaymentMethods]);

  const hasProducts = useMemo(() => {
    return orderProducts.length > 0;
  }, [orderProducts]);

  const handleAddPaymentMethod = useCallback(async () => {
    if (!newPaymentMethodId || !newPaymentValue) {
      toast.error("Selecione um método de pagamento e informe o valor");
      return;
    }
    try {
      const value = masks.unformatCurrency(newPaymentValue) / 100;
      await addPaymentMethod(newPaymentMethodId, value);
      setNewPaymentMethodId(null);
      setNewPaymentValue("");
      toast.success("Método de pagamento adicionado");
    } catch {
      toast.error("Erro ao adicionar método de pagamento");
    }
  }, [newPaymentMethodId, newPaymentValue, addPaymentMethod]);

  const handleRemovePaymentMethod = useCallback(
    async (orderPaymentMethodId: number) => {
      try {
        await removeOrderPaymentMethod(orderPaymentMethodId);
        toast.success("Método de pagamento removido");
      } catch {
        toast.error("Erro ao remover método de pagamento");
      }
    },
    [removeOrderPaymentMethod],
  );

  const handleUpdatePaymentMethodValue = useCallback(
    async (orderPaymentMethodId: number, value: number) => {
      try {
        await updateOrderPaymentMethod(orderPaymentMethodId, value);
      } catch {
        toast.error("Erro ao atualizar valor");
      }
    },
    [updateOrderPaymentMethod],
  );

  const availablePaymentMethods = useMemo(() => {
    const usedIds = new Set(
      order?.orderPaymentMethods?.map((opm) => opm.paymentMethodId) ?? [],
    );
    return paymentMethods?.filter((method) => !usedIds.has(method.id)) ?? [];
  }, [paymentMethods, order?.orderPaymentMethods]);

  const handleClientChange = useCallback(
    async (client: { id: number; name: string } | undefined) => {
      await updateClient(client?.id ?? null);
    },
    [updateClient],
  );

  const helperLabel = useMemo(() => {
    if (order?.status === OrderStatus.PAID) return "O pedido já foi pago";
    if (order?.status === OrderStatus.WAITING_FOR_PAYMENT)
      return "O pedido está aguardando pagamento";
    return undefined;
  }, [order?.status]);

  const canConfirm =
    !isOrderDisabledByAge &&
    hasPaymentMethod &&
    hasProducts &&
    !!order?.client &&
    !isPartsSynchronizedError;

  const confirmTrigger = (
    <Button
      variant="primary"
      className={styles.confirmButton}
      disabled={!canConfirm}
    >
      {isOrderDisabledByAge ? "Requer responsável" : "Fechar Pedido"}
    </Button>
  );

  const confirmModal = order && (
    <ConfirmModal
      onSave={handleConfirmOrder}
      title="Confirmar Pedido"
      label="Confirmar Pedido"
      fullWidthLabel
      trigger={confirmTrigger}
    >
      <ConfirmOrderContent order={order} />
    </ConfirmModal>
  );

  return (
    <div className={styles.orderEdit}>
      {/* Alerts */}
      <div className={styles.alerts}>
        <Visible condition={requireResponsible && !order?.client?.responsible}>
          <Alert type="warning">
            <div className={styles.alertContent}>
              <div className={styles.alertContentData}>
                <h3 className={styles.title}>Atenção</h3>
                <p>
                  O cliente é menor de idade e o pedido requer o cadastro de
                  um(a) responsável.
                </p>
              </div>
              <ResponsibleModal onSave={refetch} client={order?.client} />
            </div>
          </Alert>
        </Visible>

        <Visible condition={order?.client?.hasHealthConditions}>
          <Alert type="warning">
            <div className={styles.alertContentData}>
              <h3 className={styles.title}>Atenção</h3>
              <p>O cliente possui algumas condições de saúde</p>
              <div className={styles.healthConditionsTags}>
                {order?.client?.healthConditions?.map((condition) => (
                  <Tag key={condition.value}>{condition.name}</Tag>
                ))}
              </div>
              {order?.client?.healthNotes && <p>{order.client.healthNotes}</p>}
            </div>
          </Alert>
        </Visible>

        <Visible condition={requireResponsible && !!order?.client?.responsible}>
          <Alert type="info">
            <div className={styles.alertContentData}>
              <h3 className={styles.titleInfo}>Responsável</h3>
              <p>
                {order?.client?.responsible?.name} -{" "}
                {masks.formatCpf(order?.client?.responsible?.cpf ?? "")} -{" "}
                {masks.formatPhone(order?.client?.responsible?.phone ?? "")}
              </p>
            </div>
          </Alert>
        </Visible>

        {isPartsSynchronizedError && (
          <div className={styles.syncWarning}>{isPartsSynchronizedError}</div>
        )}
      </div>

      {/* Client Card */}
      <Form form={form} onSubmit={() => {}}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>
              <MdPerson size={18} />
              <span>Cliente</span>
            </div>
          </div>
          <div className={cn(styles.cardBody, styles.clientBody)}>
            <ClientSelector
              label="Cliente"
              placeholder="Selecione um cliente"
              disabled={isNotEditable}
              disabledHelperText={helperLabel}
              selectCondition={(client) => client.id !== order?.client?.id}
              link={
                order?.client?.id
                  ? {
                      to: `/clientes/${order?.client?.id}/editar`,
                      label: "Editar cliente",
                    }
                  : undefined
              }
              value={
                order?.client
                  ? { id: order.client.id, name: order.client.name }
                  : undefined
              }
              onChange={handleClientChange}
            />
            <Visible condition={!!order?.client?.observations}>
              <div className={styles.clientObs}>
                {order?.client?.observations}
              </div>
            </Visible>
          </div>
        </div>
      </Form>

      {/* Products Card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>
            <MdShoppingCart size={18} />
            <span>Produtos ({orderProducts.length})</span>
          </div>
          <Visible condition={!isNotEditable}>
            <Button onClick={() => openProductSelectionModal()}>
              Adicionar
            </Button>
          </Visible>
        </div>

        {orderProducts.length === 0 && !isLoadingOrder ? (
          <div className={styles.emptyState}>Nenhum produto adicionado</div>
        ) : (
          <div className={styles.productsTable}>
            <Form form={form} onSubmit={() => {}}>
              <Table
                columns={columns}
                data={orderProducts}
                loading={isLoadingOrder}
                className={styles.table}
              />
            </Form>
          </div>
        )}
      </div>

      {/* Payment Methods Card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>
            <MdPayment size={18} />
            <span>Pagamento</span>
          </div>
        </div>
        <div className={styles.cardBody}>
          {order?.orderPaymentMethods &&
            order.orderPaymentMethods.length > 0 && (
              <ul className={styles.paymentMethodsList}>
                {order.orderPaymentMethods.map((opm) => (
                  <li key={opm.id} className={styles.paymentMethodItem}>
                    <span className={styles.paymentMethodName}>
                      {opm.paymentMethodName}
                    </span>
                    {isNotEditable ? (
                      <span
                        className={cn(
                          styles.paymentMethodValue,
                          styles.paymentMethodValueNotEditable,
                        )}
                      >
                        {opm.value.formatted}
                      </span>
                    ) : (
                      <EditableCell
                        value={opm.value.value}
                        mask={(value) => masks.formatCurrency(value.toString())}
                        alignment="right"
                        className={styles.paymentMethodValue}
                        onBlur={async (value) => {
                          const newValue = masks.unformatCurrency(
                            String(value),
                          );
                          await handleUpdatePaymentMethodValue(
                            opm.id,
                            newValue / 100,
                          );
                        }}
                      />
                    )}
                    <Visible condition={!isNotEditable}>
                      <IconButton
                        onClick={() => handleRemovePaymentMethod(opm.id)}
                      >
                        <MdDelete size={16} className={styles.actionButton} />
                      </IconButton>
                    </Visible>
                  </li>
                ))}
              </ul>
            )}

          <Visible condition={!isNotEditable}>
            <div
              className={styles.addPaymentMethod}
              key={order?.orderPaymentMethods?.length ?? 0}
            >
              <Select
                label="Método"
                placeholder="Selecione"
                options={availablePaymentMethods.map((method) => ({
                  label: method.name,
                  value: method.id,
                }))}
                onSelect={(option) =>
                  setNewPaymentMethodId(option?.value as number)
                }
                onClear={() => setNewPaymentMethodId(null)}
              />
              <Input
                label="Valor"
                placeholder="R$ 0,00"
                value={newPaymentValue}
                mask={(value) => masks.formatCurrency(value)}
                onChange={(e) => setNewPaymentValue(e.target.value)}
              />
              <Button
                onClick={handleAddPaymentMethod}
                disabled={!newPaymentMethodId || !newPaymentValue}
                className={styles.addPaymentMethodButton}
                prefixIcon={<MdAdd />}
              >
                Adicionar
              </Button>
            </div>
          </Visible>
        </div>
      </div>

      {/* Summary Card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>
            <MdReceipt size={18} />
            <span>Resumo</span>
          </div>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.summaryBody}>
            <div className={styles.summaryLine}>
              <span>Produtos</span>
              <span>{order?.productValue.formatted ?? "R$ 0,00"}</span>
            </div>

            <div className={styles.summaryLine}>
              <span>Comissões</span>
              <span className={styles.redValue}>
                {order?.comissionsValue.formatted ?? "R$ 0,00"}
              </span>
            </div>

            <Visible
              condition={order?.comissions && order?.comissions.length > 0}
            >
              <ul className={styles.comissionsTags}>
                {order?.comissions.map((comission) => (
                  <li key={comission.id} className={styles.comissionTag}>
                    <div className={styles.comissionTagContent}>
                      <span className={styles.comissionTagLabel}>
                        {comission.name.split(" ")[0]}
                      </span>
                      <span className={styles.comissionTagValue}>
                        {comission.value.formatted}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </Visible>

            <div className={styles.summaryTotal}>
              <span>Total</span>
              <strong className={styles.totalValueBig}>
                {order?.totalValue.formatted ?? "R$ 0,00"}
              </strong>
            </div>
          </div>
        </div>

        <Visible condition={order?.status !== OrderStatus.WAITING_FOR_PAYMENT}>
          <div className={styles.desktopAction}>
            {isNotEditable ? (
              <ConfirmModal
                onSave={async () => {
                  await OrderRequests.reopen(Number(id));
                  refetch();
                }}
                title="Reabrir Pedido"
                label="Reabrir Pedido"
                fullWidthLabel
                danger
              >
                <p>Tem certeza que deseja reabrir este pedido?</p>
                <br />
                <p>
                  Todos os itens serão <b>devolvidos ao estoque.</b>
                </p>
              </ConfirmModal>
            ) : (
              confirmModal
            )}
          </div>
        </Visible>

        <Visible condition={order?.status === OrderStatus.WAITING_FOR_PAYMENT}>
          <div className={styles.desktopAction}>
            <Button variant="primary" loading className={styles.confirmButton}>
              Aguardando Pagamento
            </Button>
          </div>
        </Visible>
      </div>

      {/* Attachments Card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>
            <MdAttachFile size={18} />
            <span>Anexos</span>
          </div>
        </div>
        <div className={cn(styles.cardBody, styles.attachmentsBody)}>
          <ImageUpload
            label=" "
            onChange={handleAttachImages}
            showPreviewList={false}
            acceptCapture
            compressable
          />
          <ImagePreviewList
            previews={
              attachedImages?.orderImages.map((image) => ({
                id: image.id,
                url: image.url,
                thumbnailUrl: image.thumbnailUrl,
              })) || []
            }
            onRemove={handleRemoveImage}
          />
        </div>
      </div>

      {/* Sticky mobile footer */}
      <div className={styles.stickyFooter}>
        <div className={styles.stickyTotal}>
          <span>Total</span>
          <strong>{order?.totalValue.formatted ?? "R$ 0,00"}</strong>
        </div>
        <div className={styles.stickyAction}>
          <Visible
            condition={order?.status !== OrderStatus.WAITING_FOR_PAYMENT}
          >
            {isNotEditable ? (
              <ConfirmModal
                onSave={async () => {
                  await OrderRequests.reopen(Number(id));
                  refetch();
                }}
                title="Reabrir Pedido"
                label="Reabrir"
                danger
              >
                <p>Tem certeza que deseja reabrir este pedido?</p>
                <br />
                <p>
                  Todos os itens serão <b>devolvidos ao estoque.</b>
                </p>
              </ConfirmModal>
            ) : (
              order && (
                <ConfirmModal
                  onSave={handleConfirmOrder}
                  title="Confirmar Pedido"
                  label="Fechar Pedido"
                  trigger={
                    <Button variant="primary" disabled={!canConfirm}>
                      {isOrderDisabledByAge
                        ? "Requer responsável"
                        : "Fechar Pedido"}
                    </Button>
                  }
                >
                  <ConfirmOrderContent order={order} />
                </ConfirmModal>
              )
            )}
          </Visible>
          <Visible
            condition={order?.status === OrderStatus.WAITING_FOR_PAYMENT}
          >
            <Button variant="primary" loading>
              Aguardando
            </Button>
          </Visible>
        </div>
      </div>

      <LazyProductSelectionModal
        isOpen={productSelectionModalProps.isOpen}
        onClose={productSelectionModalProps.onClose}
        onSave={async (data) => {
          await handleAddProducts(data);
        }}
        productInOrder={orderProducts.map((op) => ({
          id: op.id,
          product: op.stock.product,
          stock: op.stock,
        }))}
      />
    </div>
  );
};
