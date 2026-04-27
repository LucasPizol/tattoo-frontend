import { Input } from "@/components/ui/Input";
import { Loading } from "@/components/ui/Loading";
import { Pagination } from "@/components/ui/Pagination";
import { Select } from "@/components/ui/Select";
import { Visible } from "@/components/Visible";
import { useCategoryList } from "@/features/categories/hooks/useCategoryList";
import { useProduct } from "@/features/products/hooks/useProduct";
import { useUserList } from "@/features/users/http/queries/useUserList";
import { useProductType } from "@/hooks/useProductType";
import { useCallback } from "react";
import { MdSearch } from "react-icons/md";
import type { SelectedProductInOrder, SelectionModalProduct } from "..";
import { ProductCard } from "../../ProductCard";
import styles from "../styles.module.scss";
import { StockMovementForm } from "@/features/products/components/StockMovementForm";
import { useStockMovementForm } from "@/features/stock/hooks/useStockMovementForm";

type ModalContentProps = {
  selectedProducts: SelectionModalProduct[];
  productsInOrder: SelectedProductInOrder[];
  productData: ReturnType<typeof useProduct>;
  onToggleProduct?: (product: SelectionModalProduct) => void;
};

const ModalContent = ({
  productsInOrder,
  selectedProducts,
  productData,
  onToggleProduct,
}: ModalContentProps) => {
  const { products, isLoading, pagination, onFinishFilters } = productData;

  const { users, isLoading: isLoadingUsers } = useUserList();
  const { categories, isLoading: isLoadingCategories } = useCategoryList();
  const { productTypes = [], isLoading: isLoadingProductTypes } =
    useProductType();

  const handleToggleProduct = (product: SelectionModalProduct) => {
    if (onToggleProduct) {
      onToggleProduct(product);
      return;
    }
  };

  const {
    open: openStockMovementForm,
    modalProps: stockMovementModalProps,
    form: stockMovementForm,
  } = useStockMovementForm();

  const isSelectedProduct = useCallback(
    (product: Omit<SelectionModalProduct, "product">) => {
      const selected = selectedProducts.some(
        (p) => p.product.id === product.id,
      );

      if (selected) return true;

      if (product.stockList.length === 1 && product.stock) {
        return productsInOrder.some(
          (p) =>
            p.product.id === product.id && p.stock?.id === product.stock?.id,
        );
      }

      return false;
    },
    [productsInOrder, selectedProducts],
  );

  const isDisabledProduct = useCallback(
    (product: Omit<SelectionModalProduct, "product">) => {
      if (
        product.stockList.length === 1 &&
        product.stock &&
        productsInOrder.some((p) => p.stock?.id === product.stock?.id)
      )
        return true;

      const allProductsInOrder = productsInOrder.filter(
        (p) => p.product.id === product.id,
      );

      return allProductsInOrder.length === product.stockList.length;
    },
    [],
  );

  return (
    <div className={styles.content}>
      <div className={styles.searchContainer}>
        <Input
          onDebounceChange={(value) => {
            onFinishFilters({
              name_cont: value,
            });
          }}
          label="Buscar produtos..."
          prefixIcon={<MdSearch />}
          autoFocus
        />
        <Select
          onSelect={(value) => {
            onFinishFilters({
              material_id_eq: value?.value,
            });
          }}
          onClear={() => {
            onFinishFilters({
              material_id_eq: undefined,
            });
          }}
          placeholder="Selecione uma categoria"
          label="Categoria"
          options={
            categories?.map((category) => ({
              label: category.name,
              value: category.id,
            })) ?? []
          }
          loading={isLoadingCategories}
        />
        <Select
          onSelect={(value) => {
            onFinishFilters({
              product_type_eq: value?.value,
            });
          }}
          onClear={() => {
            onFinishFilters({
              product_type_eq: undefined,
            });
          }}
          placeholder="Selecione um tipo de produto"
          label="Tipo de Produto"
          options={
            productTypes?.map((productType) => ({
              label: productType.label,
              value: productType.key,
            })) ?? []
          }
          loading={isLoadingProductTypes}
        />
        <Select
          onSelect={(value) => {
            onFinishFilters({
              stocks_user_id_eq: value?.value,
            });
          }}
          onClear={() => {
            onFinishFilters({
              stocks_user_id_eq: undefined,
            });
          }}
          placeholder="Selecione um dono"
          label="Dono"
          options={
            users?.map((user) => ({
              label: user.name.split(" ")[0],
              value: user.id,
            })) ?? []
          }
          loading={isLoadingUsers}
        />
      </div>

      <Visible condition={!isLoading}>
        <div className={styles.productsGrid}>
          {products?.map((product) => {
            const hasMultipleStocks = product.stock.length > 1;

            const isSelected = isSelectedProduct({
              id: product.id,
              stockList: product.stock,
              stock: hasMultipleStocks ? null : product.stock[0],
            });

            const isDisabled = isDisabledProduct({
              id: product.id,
              stockList: product.stock,
              stock: hasMultipleStocks ? null : product.stock[0],
            });

            return (
              <ProductCard
                key={product.id}
                product={product}
                isSelected={isSelected}
                hasMultipleStocks={hasMultipleStocks}
                onSelect={() => {
                  handleToggleProduct({
                    id: product.id,
                    product,
                    stockList: product.stock,
                    stock: hasMultipleStocks ? null : product.stock[0],
                  });
                }}
                onAddStock={() => {
                  openStockMovementForm(
                    {
                      quantity: 1,
                    },
                    product,
                  );
                }}
                disabled={isDisabled}
              />
            );
          })}
        </div>
      </Visible>

      {products?.length === 0 && !isLoading && (
        <div className={styles.emptyState}>
          <p>Nenhum produto encontrado</p>
        </div>
      )}

      <Visible condition={isLoading}>
        <div className={styles.emptyState}>
          <Loading size={32} />
          <p>Buscando produtos, aguarde...</p>
        </div>
      </Visible>

      <Pagination
        pagination={pagination}
        onChange={pagination.onChange}
        className={styles.pagination}
      />

      <StockMovementForm
        {...stockMovementModalProps}
        form={stockMovementForm}
      />
    </div>
  );
};

export default ModalContent;
