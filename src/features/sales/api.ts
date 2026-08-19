import type { SalesSummaryParams } from "@/features/sales/filters";
import { SalesSummarySchema, type SalesSummary } from "@/features/sales/schema";
import { getParsed } from "@/lib/api-client";

export function getAdminSalesSummary(params: SalesSummaryParams): Promise<SalesSummary> {
  return getParsed("/admin/sales/summary", SalesSummarySchema, { params });
}
