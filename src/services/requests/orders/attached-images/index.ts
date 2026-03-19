import { api } from "@/services/api";
import type { OrderAttachedImage } from "./types";

export const OrderAttachedImagesRequests = {
  index: (id: number) =>
    api.get<{ orderImages: OrderAttachedImage[] }>(
      `/api/orders/${id}/attached_images`
    ),
  create: (id: number, images: File[]) => {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append("order[images][]", image);
    });

    return api.post(`/api/orders/${id}/attached_images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  delete: (id: number, imageId: number) =>
    api.delete(`/api/orders/${id}/attached_images/${imageId}`),
};
