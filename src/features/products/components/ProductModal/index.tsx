import { CategoryTreeSelect } from "@/components/CategoryTreeSelect";
import { Checkbox } from "@/components/ui/Checkbox";
import { Divider } from "@/components/ui/Divider";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { ImagePreviewList } from "@/components/ui/ImageUpload/ImagePreviewList";
import { Input } from "@/components/ui/Input";
import { Modal, type ModalPropsForm } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { useCategoryList } from "@/features/categories/hooks/useCategoryList";
import { useProductType } from "@/hooks/useProductType";
import { type ProductForm } from "@/schemas/product";
import { api } from "@/services/api";
import type { Product } from "@/features/products/types";
import { masks } from "@/utils/masks";
import { useUserList } from "../../../users/http/queries/useUserList";
import styles from "./styles.module.scss";

export const ProductModal = (props: ModalPropsForm<ProductForm, Product>) => {
  const { categories } = useCategoryList({ disabled: props.isOpen });
  const { productTypes = [], isLoading: isLoadingProductTypes } =
    useProductType({
      disabled: props.isOpen,
    });

  const { users, isLoading: isLoadingUsers } = useUserList({
    disabled: props.isOpen,
  });

  const tags = props.form?.watch("tags");
  const loadedImages = props.form?.watch("loadedImages");

  return (
    <Modal
      {...props}
      title={props.currentReference ? "Editar Produto" : "Adicionar Produto"}
    >
      <Input label="Nome" placeholder="Nome do produto" field="name" />

      <div className={styles.row}>
        <Select
          label="Categoria"
          placeholder="Categoria"
          field="materialId"
          options={
            categories?.map((category) => ({
              label: category.name,
              value: category.id,
            })) || []
          }
        />
        <Select
          label="Tipo de Produto"
          placeholder="Tipo de Produto"
          field="productType"
          options={productTypes?.map((productType) => ({
            label: productType.label,
            value: productType.key,
          }))}
          loading={isLoadingProductTypes}
        />
      </div>

      <CategoryTreeSelect
        onChange={(_, newList) => {
          props.form?.setValue(
            "tags",
            newList.map((tag) => ({
              id: tag.id,
              name: tag.title,
            })),
          );
        }}
        tag={null}
        disabledIds={tags?.map((tag) => tag.id)}
        values={
          tags?.map((tag) => ({
            id: tag.id,
            title: tag.name,
          })) || []
        }
        placeholder={`${
          tags?.length && tags.length > 0
            ? `${tags.length} locais selecionados`
            : "Selecione um local de perfuração"
        }`}
        canOpenDisabled
        onClear={() => {
          props.form?.setValue("tags", []);
        }}
      />
      <div className={styles.row}>
        <Input
          label="Valor"
          placeholder="Valor do produto"
          field="value"
          mask={masks.formatCurrency}
          className={styles.value}
        />
        {!props.currentReference && (
          <Input
            label="Quantidade inicial (opcional)"
            placeholder="Digite a quantidade inicial"
            field="quantity"
            type="number"
            className={styles.quantity}
          />
        )}
      </div>

      {!props.currentReference && (
        <Select
          label="Dona(o) do produto"
          placeholder="Dona(o)"
          field="userId"
          options={
            users?.map((user) => ({
              label: user.name,
              value: user.id,
            })) || []
          }
          loading={isLoadingUsers}
        />
      )}
      <Checkbox
        label="Obrigatório o cadastro de um responsável"
        field="requireResponsible"
      />
      <Divider
        text="Configurações do site"
        style={{ marginTop: 2, marginBottom: 2 }}
        textColor="#643074"
      />
      <div className={styles.row}>
        <Checkbox label="Mostrar" field="featured" />
        {props.form?.watch("featured") && (
          <>
            <Checkbox label="Novo" field="new" />
            <Checkbox label="Carrosel" field="carousel" />
          </>
        )}
      </div>
      <ImageUpload
        label="Imagens do Produto"
        onChange={(images) => {
          props.form?.setValue("images", images);
        }}
        maxFiles={5}
        className={styles.imageUpload}
      />
      {loadedImages && loadedImages.length > 0 && (
        <ImagePreviewList
          previews={loadedImages}
          onRemove={async (id) => {
            await api.delete(`/api/images/${id}`);
            const newImages = props.form
              ?.getValues("loadedImages")
              ?.map((image) => ({
                url: image.url,
                id: image.id,
                thumbnailUrl: image.thumbnailUrl,
              }));

            props.form?.setValue("loadedImages", newImages ?? []);
          }}
        />
      )}
    </Modal>
  );
};
