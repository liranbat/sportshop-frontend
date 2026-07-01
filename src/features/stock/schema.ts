import { z } from "zod";

export const ONE_SIZE_TOKEN = "ONE_SIZE";

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

export const StockPageSchema = z.object({
  items: z.array(StockRowSchema),
  page: z.number().int().nonnegative(),
  pageSize: z.number().int().positive(),
  totalElements: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});
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
