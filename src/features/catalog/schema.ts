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

export const StockStateSchema = z.enum(["IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK"]);

export const ProductSizeSchema = z.object({
  size: z.string().min(1),
  quantity: z.number().int().nonnegative(),
  state: StockStateSchema,
});

export const ProductDetailSchema = ProductSchema.extend({
  categoryName: z.string().min(1).max(100).optional(),
  sizes: z.array(ProductSizeSchema).optional(),
});

export type Product = z.infer<typeof ProductSchema>;
export type ProductPage = z.infer<typeof ProductPageSchema>;
export type StockState = z.infer<typeof StockStateSchema>;
export type ProductSize = z.infer<typeof ProductSizeSchema>;
export type ProductDetail = z.infer<typeof ProductDetailSchema>;
