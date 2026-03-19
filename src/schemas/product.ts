import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  materialId: z.number({
    error: "Material é obrigatório",
  }),
  value: z.string().min(0, { message: "Valor é obrigatório" }),
  tags: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
    })
  ),
  requireResponsible: z.boolean(),
  quantity: z.number().optional(),
  productType: z.string().optional().nullable(),
  featured: z.boolean().optional(),
  new: z.boolean().optional(),
  carousel: z.boolean().optional(),
  userId: z.number().optional().nullable(),
  images: z.array(z.instanceof(File)).optional(),
  loadedImages: z
    .array(
      z.object({
        url: z.string(),
        id: z.number(),
        thumbnailUrl: z.string().optional(),
      })
    )
    .optional(),
});

const defaultValues: ProductForm = {
  name: "",
  materialId: 0,
  value: "",
  tags: [],
  requireResponsible: false,
  quantity: undefined,
  productType: undefined,
  featured: true,
  new: true,
  carousel: false,
  userId: undefined,
  images: [],
  loadedImages: [],
};

export const ProductSchema = {
  schema,
  defaultValues,
};

export type ProductForm = z.infer<typeof schema>;
