import { ImagePreview } from "@/components/ui/ImageUpload/ImagePreview";
import { Modal, type ModalPropsNoForm } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Table } from "@/components/ui/Table";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { SelectedProductInOrder, SelectionModalProduct } from "..";
import styles from "./styles.module.scss";

type StockSelectionModalProps = ModalPropsNoForm<SelectedProductInOrder[]> & {
  productsNeedingStock: SelectionModalProduct[];
  productsInOrder: SelectedProductInOrder[];
  onSave: (products: SelectionModalProduct[]) => void | Promise<void>;
};

export const StockSelectionModal = ({
  productsNeedingStock,
  productsInOrder,
  onSave,
  onClose,
  ...modalProps
}: StockSelectionModalProps) => {
  const [selectedStocks, setSelectedStocks] = useState<SelectionModalProduct[]>(
    [],
  );

  const existingProductInOrder = useMemo(() => {
    return productsInOrder
      .filter((p) =>
        productsNeedingStock.some((np) => np.product.id === p.product.id),
      )
      .reduce(
        (acc, p) => {
          acc[p.stock!.id] = true;
          return acc;
        },
        {} as Record<number, boolean>,
      );
  }, [productsInOrder, productsNeedingStock]);

  const getAvailableStocks = useCallback(
    (product: SelectedProductInOrder) => {
      return product.product.stock.filter(
        (stock) => stock.quantity > 0 && !existingProductInOrder[stock.id],
      );
    },
    [existingProductInOrder],
  );

  useEffect(() => {
    if (!modalProps.isOpen) return;

    setSelectedStocks(
      productsNeedingStock.map((p) => {
        const availableStocks = getAvailableStocks(p);

        return {
          ...p,
          stock: availableStocks.length === 1 ? availableStocks[0] : null,
        };
      }),
    );
  }, [productsNeedingStock, modalProps.isOpen]);

  const columns = useMemo(
    () => [
      {
        key: "image",
        label: " ",
        minWidth: "80px",
        maxWidth: "80px",
        padding: "8px",
        render: (product: SelectedProductInOrder) => (
          <ImagePreview
            images={product.product.images}
            maxWidth="70px"
            maxHeight="70px"
            rounded
          />
        ),
      },
      {
        key: "name",
        label: "Produto",
        render: (product: SelectedProductInOrder) => (
          <div className={styles.productInfo}>
            <strong>{product.product.name}</strong>
            <span className={styles.material}>
              {product.product.material.name}
            </span>
          </div>
        ),
      },
      {
        key: "stock",
        label: "Selecionar Estoque",
        minWidth: "200px",
        render: (product: SelectedProductInOrder) => {
          const availableStocks = getAvailableStocks(product);

          const options = availableStocks.map((stock) => ({
            label: `${stock.user.name.split(" ")[0]} (${stock.quantity} un.)`,
            value: stock.id,
            stock: stock,
          }));

          return (
            <Select
              noForm
              options={options}
              value={product.stock?.id}
              onSelect={(option) => {
                setSelectedStocks((prev) => {
                  return prev.map((p) => {
                    if (p.product.id === product.product.id) {
                      return { ...p, stock: option?.stock };
                    }
                    return p;
                  });
                });
              }}
              label=""
              placeholder="Selecione o vendedor"
            />
          );
        },
      },
    ],
    [getAvailableStocks],
  );

  return (
    <Modal
      title="Selecionar Estoque"
      {...modalProps}
      onClose={onClose}
      onSubmit={async () => {
        await onSave(selectedStocks);
        setSelectedStocks([]);
      }}
    >
      <div className={styles.container}>
        <p className={styles.description}>
          Os produtos abaixo possuem múltiplos estoques. Selecione de qual
          vendedor cada produto deve ser retirado:
        </p>

        <Table columns={columns} data={selectedStocks} />
      </div>
    </Modal>
  );
};
