import { useModal } from "@/components/ui/Modal/useModal";
import { TagSchema, type TagForm } from "@/schemas/tag";
import type { Tag } from "../types";
import { useCreateTag, useUpdateTag, useDeleteTag } from "../http/mutations/tagMutations";

export const useTagForm = () => {
  const { mutateAsync: createTag } = useCreateTag();
  const { mutateAsync: updateTag } = useUpdateTag();
  const { mutateAsync: deleteTag } = useDeleteTag();

  const { open, close, modalProps, form } = useModal<TagForm, Tag | null>({
    onSubmit: async (data, reference) => {
      const payload = {
        name: data.name,
        notes: data.notes,
        tag_id: data.parentTag?.id ?? null,
      };

      if (reference) {
        await updateTag({ id: reference.id, payload });
      } else {
        await createTag(payload);
      }
      form.reset(TagSchema.defaultValues);
    },
    initialValues: TagSchema.defaultValues,
    schema: TagSchema.schema,
  });

  const handleDestroyTag = async (tag: Tag) => {
    await deleteTag(tag.id);
  };

  return {
    form,
    setTag: (tag: Tag | null) => {
      if (tag) {
        form.reset({
          name: tag.name,
          notes: tag.notes,
          parentTag: tag.parentTag ? { id: tag.parentTag.id, name: tag.parentTag.name } : null,
        });
      } else {
        form.reset(TagSchema.defaultValues);
      }
    },
    handleDestroyTag,
    open,
    close,
    modalProps,
  };
};
