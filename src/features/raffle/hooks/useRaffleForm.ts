import { useModal } from "@/components/ui/Modal/useModal";
import type { DateRange } from "@/components/ui/DateRangePicker";
import type {
  SelectedProductInOrder,
  SelectionModalProduct,
} from "@/features/order/components/ProductSelectionModal";
import type { InstagramPost } from "@/features/instagram-posts/types";
import { RaffleSchema, type RaffleFormData } from "@/schemas/raffle";
import { showError } from "@/utils/show-error";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { masks } from "@/utils/masks";
import { useCreateRaffle } from "../http/mutations/raffleMutations";

export type SelectedProductDisplay = {
  id: number;
  name: string;
};

export const useRaffleForm = () => {
  const navigate = useNavigate();

  const [selectedProductNames, setSelectedProductNames] = useState<
    SelectedProductDisplay[]
  >([]);

  const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null);

  const form = useForm<RaffleFormData>({
    resolver: zodResolver(
      RaffleSchema.schema,
    ) as unknown as Resolver<RaffleFormData>,
    defaultValues: RaffleSchema.defaultValues,
  });

  const {
    open: openProductModal,
    close: closeProductModal,
    modalProps: productModalProps,
  } = useModal<SelectedProductInOrder[]>({ noForm: true });

  const { open: openPostModal, modalProps: postModalProps } = useModal<null>({
    noForm: true,
  });

  const { mutateAsync: createRaffle, isPending } = useCreateRaffle();

  const onSubmit = async (data: RaffleFormData) => {
    try {
      let result;
      if (selectedPost) {
        result = await createRaffle({
          name: data.name,
          description: data.description || undefined,
          primary_count: data.primary_count,
          secondary_count: data.secondary_count,
          instagram_post_id: selectedPost.id,
        });
      } else {
        result = await createRaffle({
          name: data.name,
          description: data.description || undefined,
          primary_count: data.primary_count,
          secondary_count: data.secondary_count,
          filters: {
            start_date: data.start_date || undefined,
            end_date: data.end_date || undefined,
            product_ids: data.product_ids?.length
              ? data.product_ids
              : undefined,
            min_order_value: data.min_order_value
              ? masks.unformatCurrency(data.min_order_value) / 100
              : undefined,
          },
        });
      }
      navigate(`/sorteios/${result.id}`);
    } catch (error) {
      showError(error, form);
      throw error;
    }
  };

  const handleSelectPost = (post: InstagramPost) => {
    setSelectedPost(post);
  };

  const clearPost = () => {
    setSelectedPost(null);
  };

  const handleProductSave = (products: SelectionModalProduct[]) => {
    form.setValue(
      "product_ids",
      products.map((p) => p.product.id),
    );
    setSelectedProductNames(
      products.map((p) => ({ id: p.product.id, name: p.product.name })),
    );
    closeProductModal();
  };

  const removeProduct = (id: number) => {
    const current = form.getValues("product_ids") ?? [];
    form.setValue(
      "product_ids",
      current.filter((pid) => pid !== id),
    );
    setSelectedProductNames((prev) => prev.filter((p) => p.id !== id));
  };

  const handleDateRangeChange = (range: DateRange) => {
    form.setValue(
      "start_date",
      range.startDate ? range.startDate.toISOString().split("T")[0] : undefined,
    );
    form.setValue(
      "end_date",
      range.endDate ? range.endDate.toISOString().split("T")[0] : undefined,
    );
  };

  const getDateRange = (): DateRange => {
    const startStr = form.watch("start_date");
    const endStr = form.watch("end_date");
    const parseDate = (str?: string) =>
      str ? new Date(`${str}T00:00:00`) : null;
    return {
      startDate: parseDate(startStr),
      endDate: parseDate(endStr),
    };
  };

  return {
    form,
    onSubmit,
    isPending,
    selectedProductNames,
    handleProductSave,
    removeProduct,
    openProductModal,
    productModalProps,
    handleDateRangeChange,
    getDateRange,
    selectedPost,
    handleSelectPost,
    clearPost,
    openPostModal,
    postModalProps,
  };
};
