import { z } from "zod";
import { OrderStatusSchema } from "@/features/orders/schema";

export const TopProductsSortBySchema = z.enum(["revenue", "quantity"]);

export const SalesPeriodStatsSchema = z.object({
  orderCount: z.number().int().nonnegative(),
  revenue: z.number().min(0),
  cancelledCount: z.number().int().nonnegative(),
  cancelRate: z.number().min(0).max(100),
  averageOrderValue: z.number().min(0),
  itemsSoldAmount: z.number().int().nonnegative(),
});

export const SalesStatusStatsSchema = z.object({
  status: OrderStatusSchema,
  orderCount: z.number().int().nonnegative(),
  revenue: z.number().min(0),
});

export const SalesTopProductStatsSchema = z.object({
  productId: z.number().int().positive(),
  productName: z.string().min(1).max(200),
  productImageUrl: z.string().max(500).nullable().optional(),
  result: z.number().min(0),
});

export const SalesSummarySchema = z.object({
  dateFrom: z.iso.date(),
  dateTo: z.iso.date(),
  topProductsSortBy: TopProductsSortBySchema,
  summary: SalesPeriodStatsSchema,
  statusBreakdown: z.array(SalesStatusStatsSchema),
  topProducts: z.array(SalesTopProductStatsSchema),
});

export type TopProductsSortBy = z.infer<typeof TopProductsSortBySchema>;
export type SalesPeriodStats = z.infer<typeof SalesPeriodStatsSchema>;
export type SalesStatusStats = z.infer<typeof SalesStatusStatsSchema>;
export type SalesTopProductStats = z.infer<typeof SalesTopProductStatsSchema>;
export type SalesSummary = z.infer<typeof SalesSummarySchema>;
