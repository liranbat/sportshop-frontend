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

export type StockSetRequest = {
  quantity: number;
  lowStockThreshold: number | null;
};

export type StockAdjustRequest = {
  delta: number;
};

export type StockSizeAddRequest = {
  size: string;
  quantity: number;
  lowStockThreshold?: number | null;
};
