import { useModal } from "@/components/ui/Modal/useModal";
import { ProductSchema, type ProductForm } from "@/schemas/product";
import type { Product } from "@/features/products/types";
import {
  useCreateProduct,
  useUpdateProduct,
} from "../http/mutations/productMutations";

export const useProductForm = () => {
  const { mutateAsync: createProduct } = useCreateProduct();
  const { mutateAsync: updateProduct } = useUpdateProduct();

  const { open, close, modalProps, form } = useModal<ProductForm, Product>({
    onSubmit: async (data, product) => {
      await onSaveProduct(data, product);
    },
    initialValues: ProductSchema.defaultValues,
    schema: ProductSchema.schema,
  });

  const buildFormData = (payload: Record<string, any>) => {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) =>
          formData.append(`product[${key}][]`, item as any),
        );
        return;
      }
      formData.append(`product[${key}]`, String(value).trim());
    });
    return formData;
  };

  const onSaveProduct = async (data: ProductForm, product: Product | null) => {
    const productPayload = {
      name: data.name,
      material_id: data.materialId,
      value: Number(
        data.value.replace("R$ ", "").replaceAll(".", "").replaceAll(",", "."),
      ),
      tag_ids: data.tags.map((tag) => tag.id),
      require_responsible: data.requireResponsible,
      images: data.images ?? [],
      quantity: data.quantity,
      featured: data.featured ?? false,
      new: data.new ?? false,
      carousel: data.carousel ?? false,
      user_id: data.userId,
    };

    if (data.productType) {
      Reflect.set(productPayload, "product_type", data.productType);
    }

    if (product) {
      const { quantity: _quantity, ...updatePayload } = productPayload;
      const formData = buildFormData(updatePayload);
      await updateProduct({ id: product.id, formData });
    } else {
      const formData = buildFormData(productPayload);
      await createProduct(formData);
    }
    form.reset(ProductSchema.defaultValues);
  };

  const tags = form.watch("tags");

  return {
    open,
    close,
    modalProps,
    onSaveProduct,
    tags,
    form,
  };
};
