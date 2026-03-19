import { Action } from "@/components/Action";
import { ConfirmModal } from "@/components/ConfirmModal";
import { FiltersCard } from "@/components/FiltersCard";
import { PageWrapper } from "@/components/PageWrapper";
import { CatalogViewer } from "@/components/ProductCatalog/CatalogViewer";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { IconButton } from "@/components/ui/IconButton";
import { ImagePreview } from "@/components/ui/ImageUpload/ImagePreview";
import { Input } from "@/components/ui/Input";
import { Popover } from "@/components/ui/Popover";
import { Select } from "@/components/ui/Select";
import { Table, type Column } from "@/components/ui/Table";
import { Tag, type TagColor } from "@/components/ui/Tag";
import { useMobile } from "@/hooks/useMobile";
import type { ProductWithMaterial } from "@/features/products/types";
import { masks } from "@/utils/masks";
import { useMemo } from "react";
import { MdAdd, MdDelete, MdEdit, MdSearch } from "react-icons/md";
import { useStockMovementForm } from "../stock/hooks/useStockMovementForm";
import { ProductModal } from "./components/ProductModal";
import { useProduct } from "./hooks/useProduct";
import { useProductForm } from "./hooks/useProductForm";
import { useUserList } from "../users/http/queries/useUserList";
import styles from "./styles.module.scss";
import { StockMovementForm } from "./components/StockMovementForm";

const HighlightText = ({
  text,
  highlight,
}: {
  text: string;
  highlight?: string;
}) => {
  if (!highlight?.trim()) {
    return <>{text}</>;
  }

  const words = highlight
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

  if (words.length === 0) {
    return <>{text}</>;
  }

  const regex = new RegExp(`(${words.join("|")})`, "gi");
  const parts = text.split(regex);

  const wordsLower = new Set(words.map((w) => w.toLowerCase()));

  return (
    <div style={{ display: "inline-block" }}>
      {parts.map((part, index) =>
        wordsLower.has(part.toLowerCase()) ? (
          <mark
            key={index}
            style={{
              fontWeight: "bold",
              borderRadius: "2px",
              backgroundColor: "transparent",
            }}
          >
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </div>
  );
};

export const Products = () => {
  const {
    products,
    pagination,
    filters,
    refetch,
    handleDestroyProduct,
    isLoading,
    onFinishFilters,
    filtersForm,
  } = useProduct();

  const { users, isLoading: isLoadingUsers } = useUserList({
    disabled: false,
  });

  const { open: openProductForm, modalProps: productModalProps } =
    useProductForm();

  const {
    open: openStockMovementForm,
    modalProps: stockMovementModalProps,
    form: stockMovementForm,
  } = useStockMovementForm();

  const isMobile = useMobile();

  const columns = useMemo((): Column<ProductWithMaterial>[] => {
    return [
      {
        key: "images",
        label: " ",
        minWidth: "94px",
        maxWidth: "94px",
        padding: "8px",
        render: (product: ProductWithMaterial) => {
          return (
            <ImagePreview
              images={product.images.map((image) => ({
                url: image.url,
                id: image.id,
                thumbnailUrl: image.thumbnailUrl,
              }))}
              clickable
              rounded
              maxHeight="75px"
              maxWidth="75px"
            />
          );
        },
      },
      {
        key: "name",
        label: "Nome",
        width: "250px",
        render: (product: ProductWithMaterial) => (
          <Popover content={product.name}>
            <HighlightText text={product.name} highlight={filters.name_cont} />
          </Popover>
        ),
      },
      {
        key: "material",
        label: "Material",
        render: (product: ProductWithMaterial) => (
          <span>{product.material.name}</span>
        ),
      },
      {
        key: "value",
        label: "Valor",
        render: (product: ProductWithMaterial) => (
          <span>{product.value.formatted}</span>
        ),
      },
      {
        key: "quantity",
        label: isMobile ? "Qtd" : "Quantidade",
        width: isMobile ? "50px" : undefined,
        render: (product: ProductWithMaterial) => {
          return (
            <div className={styles.quantity}>
              {product.stock.reduce((acc, stock) => acc + stock.quantity, 0)}
            </div>
          );
        },
      },
      {
        key: "productType",
        label: "Tipo de Produto",
        render: (product: ProductWithMaterial) => {
          if (!product.productType.key) return <span>N/D</span>;

          return (
            <Tag color={product.productType.color as TagColor}>
              {product.productType.label}
            </Tag>
          );
        },
      },
      {
        label: " ",
        key: "actions",
        width: "auto",
        padding: "0px",
        render: (product: ProductWithMaterial) => {
          return (
            <Action>
              <div className={styles.actions}>
                <IconButton
                  title="Adicionar Quantidade"
                  onClick={() => {
                    openStockMovementForm({ quantity: 1 }, product);
                  }}
                >
                  <MdAdd size={24} className="add" />
                </IconButton>
                <IconButton
                  title="Editar Produto"
                  onClick={() => {
                    openProductForm(
                      {
                        name: product.name,
                        materialId: product.material.id,
                        value: masks.formatCurrency(
                          product.value.value.toString(),
                        ),
                        tags: product.tags.map((tag) => ({
                          id: Number(tag.id),
                          name: tag.name,
                        })),
                        requireResponsible: product.requireResponsible,
                        productType: product.productType.key || undefined,
                        carousel: product.carousel,
                        featured: product.featured,
                        new: product.new,
                        userId: product.user?.id || undefined,
                        images: [],
                        loadedImages: product.images.map((image) => ({
                          url: image.url,
                          id: image.id,
                          thumbnailUrl: image.thumbnailUrl,
                        })),
                      },
                      product,
                    );
                  }}
                >
                  <MdEdit size={24} className="edit" />
                </IconButton>
                <ConfirmModal
                  onSave={async () => {
                    if (!product) return;
                    await handleDestroyProduct(product);
                    refetch();
                  }}
                  title="Excluir Produto"
                  trigger={
                    <IconButton title="Excluir Produto">
                      <MdDelete size={24} className="delete" />
                    </IconButton>
                  }
                >
                  <p>Tem certeza que deseja excluir este produto?</p>
                </ConfirmModal>
              </div>
            </Action>
          );
        },
      },
    ];
  }, [
    isMobile,
    openStockMovementForm,
    openProductForm,
    handleDestroyProduct,
    refetch,
    filters.name_cont,
  ]);

  const userList = useMemo(() => {
    return (
      users?.map((user) => ({
        label: user.name,
        value: user.id,
      })) || []
    );
  }, [users]);

  return (
    <PageWrapper
      title="Produtos"
      subtitle="Gerencie seus produtos e mantenha as informações atualizadas"
      actions={
        <div className={styles.headerButtons}>
          <CatalogViewer />
          <Button
            variant="primary"
            prefixIcon={<MdAdd />}
            onClick={() => openProductForm()}
          >
            Adicionar Produto
          </Button>
        </div>
      }
    >
      <FiltersCard
        form={filtersForm}
        onFinishFilters={onFinishFilters}
        alignItems="center"
        className={styles.filtersCard}
      >
        <div className={styles.filters}>
          <Input
            placeholder="Digite"
            label="Buscar produtos..."
            field="name_cont"
            prefixIcon={<MdSearch />}
            className={styles.searchInput}
            onDebounceChange={async (value) => {
              onFinishFilters({
                name_cont: value,
              });
            }}
          />
          <Select
            label="Dona(o)"
            loading={isLoadingUsers}
            options={userList}
            field="stocks_user_id_eq"
            onSelect={async ({ value }) => {
              onFinishFilters({
                stocks_user_id_eq: value,
              });
            }}
            onClear={() => {
              onFinishFilters({
                stocks_user_id_eq: undefined,
              });
            }}
          />
          <Checkbox
            label="Sem estoque"
            layout="vertical"
            field="without_stock"
            onCheckedChange={(checked) => {
              onFinishFilters({
                without_stock: checked ? true : undefined,
              });
            }}
          />
        </div>
      </FiltersCard>
      <Table
        columns={columns}
        data={products}
        loading={isLoading}
        pagination={pagination}
      />

      <StockMovementForm
        {...stockMovementModalProps}
        form={stockMovementForm}
      />

      <ProductModal {...productModalProps} />
    </PageWrapper>
  );
};
