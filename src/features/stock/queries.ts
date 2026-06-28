import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import {
  addAdminStockSize,
  adjustAdminStock,
  listAdminStock,
  removeAdminStockSize,
  setAdminStock,
} from "@/features/stock/api";
import type { StockListParams } from "@/features/stock/filters";
import type {
  StockAdjustRequest,
  StockSetRequest,
  StockSizeAddRequest,
} from "@/features/stock/schema";

export const stockQueryKeys = {
  all: ["admin-stock"] as const,
  lists: () => [...stockQueryKeys.all, "list"] as const,
  list: (params: StockListParams) => [...stockQueryKeys.lists(), params] as const,
};

export function useAdminStockListQuery(params: StockListParams) {
  return useQuery({
    queryKey: stockQueryKeys.list(params),
    queryFn: () => listAdminStock(params),
    placeholderData: keepPreviousData,
  });
}

export function useSetAdminStockMutation() {
  return useMutation({
    mutationFn: ({
      productId,
      size,
      body,
    }: {
      productId: number;
      size: string;
      body: StockSetRequest;
    }) => setAdminStock(productId, size, body),
  });
}

export function useAdjustAdminStockMutation() {
  return useMutation({
    mutationFn: ({
      productId,
      size,
      body,
    }: {
      productId: number;
      size: string;
      body: StockAdjustRequest;
    }) => adjustAdminStock(productId, size, body),
  });
}

export function useAddAdminStockSizeMutation() {
  return useMutation({
    mutationFn: ({ productId, body }: { productId: number; body: StockSizeAddRequest }) =>
      addAdminStockSize(productId, body),
  });
}

export function useRemoveAdminStockSizeMutation() {
  return useMutation({
    mutationFn: ({ productId, size }: { productId: number; size: string }) =>
      removeAdminStockSize(productId, size),
  });
}
