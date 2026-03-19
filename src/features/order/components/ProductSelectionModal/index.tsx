import { Loading } from "@/components/ui/Loading";
import { Modal, type ModalPropsNoForm } from "@/components/ui/Modal";
import { useModal } from "@/components/ui/Modal/useModal";
import { useProduct } from "@/features/products/hooks/useProduct";
import type { ProductWithMaterial } from "@/services/requests/products/types";
import { Suspense, useCallback, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { LazyModalContent } from "./ModalContent/LazyModalContent";
import { StockSelectionModal } from "./StockSelectionModal";
import styles from "./styles.module.scss";
import { ImagePreview } from "@/components/ui/ImageUpload/ImagePreview";

export type SelectionModalProduct = {
  id: number;
  product: ProductWithMaterial;
  stock: ProductWithMaterial["stock"][0] | null;
  stockList: ProductWithMaterial["stock"];
};

export type SelectedProductInOrder = Omit<SelectionModalProduct, "stockList">;

type ProductSelectionModalProps = ModalPropsNoForm<SelectedProductInOrder[]> & {
  onSave: (productInOrder: SelectionModalProduct[]) => void | Promise<void>;
  productInOrder?: SelectedProductInOrder[];
  multiple?: boolean;
};

const ProductSelectionModal = ({
  onSave,
  productInOrder = [],
  multiple = true,
  ...modalProps
}: ProductSelectionModalProps) => {
  const [selectedProducts, setSelectedProducts] = useState<
    SelectionModalProduct[]
  >([]);

  const productsNeedingStock = useMemo(() => {
    return selectedProducts.filter((p) => !p.stock);
  }, [selectedProducts]);

  const productData = useProduct({
    perPage: 40,
  });

  const {
    open: openStockSelectionModal,
    close: closeStockSelectionModal,
    modalProps: stockSelectionModalProps,
  } = useModal<SelectionModalProduct[], SelectionModalProduct[]>({
    onSubmit: async (products) => {
      await onSave(products);
    },
  });

  const handleToggleProduct = useCallback(
    (product: SelectionModalProduct) => {
      setSelectedProducts((prev) => {
        const exists = prev.some((p) => p.product.id === product.product.id);

        if (exists)
          return prev.filter((p) => p.stock?.id !== product.stock?.id);

        return [
          ...prev,
          {
            ...product,
            stock: product.stockList.length > 1 ? null : product.stockList[0],
          },
        ];
      });
    },
    [multiple],
  );

  const handleSave = async (products: SelectionModalProduct[]) => {
    try {
      const needsStockSelection = products.filter((p) => !p.stock);

      if (needsStockSelection.length > 0) {
        openStockSelectionModal();
        return;
      }

      await onSave(products);
      modalProps.onClose();
      setSelectedProducts([]);
    } catch (error) {
      toast.error("Erro ao adicionar produtos");
      throw error;
    }
  };

  const handleStockModalClose = () => {
    setSelectedProducts([]);
    closeStockSelectionModal();
  };

  return (
    <>
      <Modal
        {...modalProps}
        title="Selecionar Produtos"
        className={styles.modal}
        onSubmit={() => handleSave(selectedProducts)}
        fullScreen
        onClose={() => {
          modalProps.onClose();
          productData.clearFilters();
        }}
        leftFooterContent={
          selectedProducts.length > 0 && (
            <div className={styles.footerSummary}>
              {selectedProducts.map((p) => {
                return (
                  <div className={styles.footerSummaryItem}>
                    {p.product.images.length > 0 ? (
                      <ImagePreview
                        images={p.product.images}
                        maxWidth="24px"
                        maxHeight="24px"
                        rounded
                      />
                    ) : (
                      <div className={styles.footerSummaryImagePlaceholder} />
                    )}

                    <div className={styles.footerSummaryContent}>
                      <p className={styles.footerSummaryName}>
                        {p.product.name}
                      </p>
                      <p className={styles.footerSummaryPrice}>
                        {p.product.value.formatted}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        }
      >
        <Suspense
          fallback={
            <div className={styles.emptyState}>
              <Loading size={32} />
            </div>
          }
        >
          <LazyModalContent
            selectedProducts={selectedProducts}
            productData={productData}
            onToggleProduct={handleToggleProduct}
            productsInOrder={productInOrder}
          />
        </Suspense>
      </Modal>

      <StockSelectionModal
        isOpen={stockSelectionModalProps.isOpen}
        productsNeedingStock={productsNeedingStock}
        productsInOrder={productInOrder}
        onSave={async (products) => {
          const filteredProducts = selectedProducts.filter((p) => !!p.stock);
          await handleSave([...filteredProducts, ...products]);
        }}
        onClose={handleStockModalClose}
      />
    </>
  );
};

export default ProductSelectionModal;
