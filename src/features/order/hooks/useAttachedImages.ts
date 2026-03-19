import { useOrderAttachedImagesQuery } from "../http/queries/attachedImagesQuery";
import { useAttachOrderImages, useRemoveOrderAttachedImage } from "../http/mutations/orderAttachedImageMutations";

export const useAttachedImages = (id: number) => {
  const { data, isLoading } = useOrderAttachedImagesQuery(id);
  const { mutateAsync: attachImages } = useAttachOrderImages(id);
  const { mutateAsync: removeImage } = useRemoveOrderAttachedImage(id);

  const handleAttachImages = async (images: File[]) => {
    await attachImages(images);
  };

  const handleRemoveImage = async (imageId: number) => {
    await removeImage(imageId);
  };

  return { data, isLoading, handleAttachImages, handleRemoveImage };
};
