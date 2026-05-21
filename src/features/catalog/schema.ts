import { z } from "zod";

export const ProductSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(200),
  description: z.string().nullable(),
  categoryId: z.number().int().positive(),
  isMultiSize: z.boolean(),
  imageUrl: z.string().nullable(),
  price: z.number().min(0),
  version: z.number().int().nonnegative(),
});

export const ProductsSchema = z.array(ProductSchema);

export type Product = z.infer<typeof ProductSchema>;
