import { z } from "zod";

export const ProductSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(200),
  description: z.string().nullable(),
  categoryId: z.number().int().positive().optional(),
  isMultiSize: z.boolean(),
  imageUrl: z.string().nullable(),
  price: z.number().min(0),
  version: z.number().int().nonnegative(),
});

export const ProductPageSchema = z.object({
  items: z.array(ProductSchema),
  page: z.number().int().nonnegative(),
  pageSize: z.number().int().positive(),
  totalElements: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});

export type Product = z.infer<typeof ProductSchema>;
export type ProductPage = z.infer<typeof ProductPageSchema>;
