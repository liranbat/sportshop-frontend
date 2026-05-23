import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getProduct, listProducts } from "@/features/catalog/api";
import type { ProductListParams } from "@/features/catalog/filters";

export const catalogQueryKeys = {
  all: ["catalog"] as const,
  products: (params: ProductListParams) => [...catalogQueryKeys.all, "products", params] as const,
  product: (id: number) => [...catalogQueryKeys.all, "product", id] as const,
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

export function useProductQuery(id: number) {
  return useQuery({
    queryKey: catalogQueryKeys.product(id),
    queryFn: () => getProduct(id),
  });
}
