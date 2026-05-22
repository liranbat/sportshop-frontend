import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { listProducts } from "@/features/catalog/api";
import type { ProductListParams } from "@/features/catalog/filters";

export const catalogQueryKeys = {
  all: ["catalog"] as const,
  products: (params: ProductListParams) => [...catalogQueryKeys.all, "products", params] as const,
};

type UseProductsQueryOptions = {
  enabled?: boolean;
};

export function useProductsQuery(params: ProductListParams, options: UseProductsQueryOptions = {}) {
  return useQuery({
    queryKey: catalogQueryKeys.products(params),
    queryFn: () => listProducts(params),
    placeholderData: keepPreviousData,
    enabled: options.enabled ?? true,
  });
}
