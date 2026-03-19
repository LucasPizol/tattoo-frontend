import { useModal } from "@/components/ui/Modal/useModal";
import { CategorySchema, type CategoryForm } from "@/schemas/category";
import type { Category } from "../types";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateCategory } from "../http/mutations/categoryMutations";
import { useUpdateCategory } from "../http/mutations/categoryMutations";
import { useDeleteCategory } from "../http/mutations/categoryMutations";

export const useCategoryForm = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: createCategory } = useCreateCategory();
  const { mutateAsync: updateCategory } = useUpdateCategory();
  const { mutateAsync: deleteCategory } = useDeleteCategory();

  const handleSaveCategory = async (
    data: CategoryForm,
    category: Category | null,
  ) => {
    const payload = { name: data.name, notes: data.notes };

    if (category) await updateCategory({ id: category.id, payload });
    else await createCategory(payload);
  };

  const { open, close, isOpen, modalProps, form } = useModal<
    CategoryForm,
    Category | null
  >({
    initialValues: CategorySchema.defaultValues,
    schema: CategorySchema.schema,
    onSubmit: async (data, reference) => {
      await handleSaveCategory(data, reference ?? null);

      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "categories",
        refetchType: "all",
      });
    },
  });

  return {
    form,
    handleSaveCategory,
    handleDestroyCategory: async (id: number) => {
      await deleteCategory(id);
    },
    open,
    close,
    isOpen,
    modalProps,
  };
};
