import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAdminSalesSummary } from "@/features/sales/api";
import type { SalesSummaryParams } from "@/features/sales/filters";

export const salesQueryKeys = {
  all: ["admin-sales"] as const,
  summaries: () => [...salesQueryKeys.all, "summary"] as const,
  summary: (params: SalesSummaryParams) => [...salesQueryKeys.summaries(), params] as const,
};

export function useAdminSalesSummaryQuery(params: SalesSummaryParams) {
  return useQuery({
    queryKey: salesQueryKeys.summary(params),
    queryFn: () => getAdminSalesSummary(params),
    placeholderData: keepPreviousData,
  });
}
