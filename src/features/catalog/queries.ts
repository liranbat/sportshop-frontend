import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAdminProduct,
  getProduct,
  listAdminProducts,
  listProducts,
} from "@/features/catalog/api";
import type { ProductListParams } from "@/features/catalog/filters";
import type { ProductCreateRequest } from "@/features/catalog/schema";

export const catalogQueryKeys = {
  all: ["catalog"] as const,
  products: (params: ProductListParams) => [...catalogQueryKeys.all, "products", params] as const,
  adminProducts: (params: ProductListParams) =>
    [...catalogQueryKeys.all, "admin-products", params] as const,
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

export function useAdminProductsQuery(
  params: ProductListParams,
  options: UseProductsQueryOptions = {},
) {
  return useQuery({
    queryKey: catalogQueryKeys.adminProducts(params),
    queryFn: () => listAdminProducts(params),
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

export function useCreateAdminProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProductCreateRequest) => createAdminProduct(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: catalogQueryKeys.all });
    },
  });
}
