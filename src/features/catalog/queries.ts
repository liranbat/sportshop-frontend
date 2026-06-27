import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  archiveAdminProduct,
  createAdminProduct,
  getProduct,
  listAdminProducts,
  listProducts,
  restoreAdminProduct,
  updateAdminProduct,
} from "@/features/catalog/api";
import type { ProductListParams } from "@/features/catalog/filters";
import type {
  ProductCreateRequest,
  ProductLifecycleRequest,
  ProductUpdateRequest,
} from "@/features/catalog/schema";
import { categoriesQueryKeys } from "@/features/categories/queries";

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

export function useUpdateAdminProductMutation(productId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProductUpdateRequest) => updateAdminProduct(productId, payload),
    onSuccess: (detail) => {
      queryClient.setQueryData(catalogQueryKeys.product(productId), detail);
      void queryClient.invalidateQueries({ queryKey: catalogQueryKeys.all });
      void queryClient.invalidateQueries({ queryKey: categoriesQueryKeys.all });
    },
  });
}

export function useArchiveAdminProductMutation(productId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProductLifecycleRequest) => archiveAdminProduct(productId, payload),
    onSuccess: (detail) => {
      queryClient.setQueryData(catalogQueryKeys.product(productId), detail);
      void queryClient.invalidateQueries({ queryKey: catalogQueryKeys.all });
    },
  });
}

export function useRestoreAdminProductMutation(productId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProductLifecycleRequest) => restoreAdminProduct(productId, payload),
    onSuccess: (detail) => {
      queryClient.setQueryData(catalogQueryKeys.product(productId), detail);
      void queryClient.invalidateQueries({ queryKey: catalogQueryKeys.all });
    },
  });
}
