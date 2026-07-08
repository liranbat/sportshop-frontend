import { z } from "zod";
import { pageSchema } from "@/lib/schemas/pagination";

export { ONE_SIZE_TOKEN } from "@/lib/schemas/constants";

export const StockRowSchema = z.object({
  productId: z.number().int().positive(),
  productName: z.string(),
  productImageUrl: z.string().nullable().optional(),
  productIsArchived: z.boolean(),
  productIsMultiSize: z.boolean().optional(),
  size: z.string(),
  quantity: z.number().int().nonnegative(),
  lowStockThreshold: z.number().int().nonnegative().nullable().optional(),
});
export type StockRow = z.infer<typeof StockRowSchema>;

export const StockPageSchema = pageSchema(StockRowSchema);
export type StockPage = z.infer<typeof StockPageSchema>;

export const StockSetRequestSchema = z.object({
  quantity: z.number().int().nonnegative(),
  lowStockThreshold: z.number().int().nonnegative().nullable(),
});
export type StockSetRequest = z.infer<typeof StockSetRequestSchema>;

export const StockAdjustRequestSchema = z.object({
  delta: z.number().int(),
});
export type StockAdjustRequest = z.infer<typeof StockAdjustRequestSchema>;

export const StockSizeAddRequestSchema = z.object({
  size: z.string(),
  quantity: z.number().int().nonnegative(),
  lowStockThreshold: z.number().int().nonnegative().nullable().optional(),
});
export type StockSizeAddRequest = z.infer<typeof StockSizeAddRequestSchema>;
