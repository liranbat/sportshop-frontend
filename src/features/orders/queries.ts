import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cancelOrder,
  getAdminOrderByNumber,
  getOrderByNumber,
  listAdminOrders,
  listOrders,
} from "@/features/orders/api";
import type { OrderListParams } from "@/features/orders/filters";
import type { OrderDetail } from "@/features/orders/schema";
import { ApiError } from "@/lib/api";

export const orderQueryKeys = {
  all: ["orders"] as const,
  lists: () => [...orderQueryKeys.all, "list"] as const,
  list: (params: OrderListParams) => [...orderQueryKeys.lists(), params] as const,
  adminLists: () => [...orderQueryKeys.all, "adminList"] as const,
  adminList: (params: OrderListParams) => [...orderQueryKeys.adminLists(), params] as const,
  details: () => [...orderQueryKeys.all, "detail"] as const,
  detail: (orderNumber: string) => [...orderQueryKeys.details(), orderNumber] as const,
  adminDetails: () => [...orderQueryKeys.all, "adminDetail"] as const,
  adminDetail: (orderNumber: string) => [...orderQueryKeys.adminDetails(), orderNumber] as const,
};

export function useOrdersListQuery(params: OrderListParams, enabled: boolean = true) {
  return useQuery({
    queryKey: orderQueryKeys.list(params),
    queryFn: () => listOrders(params),
    placeholderData: keepPreviousData,
    enabled,
  });
}

export function useAdminOrdersListQuery(params: OrderListParams, enabled: boolean) {
  return useQuery({
    queryKey: orderQueryKeys.adminList(params),
    queryFn: () => listAdminOrders(params),
    placeholderData: keepPreviousData,
    enabled,
  });
}

export function useOrderDetailQuery(orderNumber: string, enabled: boolean = true) {
  return useQuery<OrderDetail, ApiError>({
    queryKey: orderQueryKeys.detail(orderNumber),
    queryFn: () => getOrderByNumber(orderNumber),
    enabled,
  });
}

export function useAdminOrderDetailQuery(orderNumber: string, enabled: boolean) {
  return useQuery<OrderDetail, ApiError>({
    queryKey: orderQueryKeys.adminDetail(orderNumber),
    queryFn: () => getAdminOrderByNumber(orderNumber),
    enabled,
  });
}

// Backend returns 204; success invalidates the detail (forces refetch -> new state) and
// both list scopes (badge moves from PAID -> CANCELLED_BY_USER on the user History page
// and on the admin Order Monitoring page).
export function useCancelOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, string>({
    mutationFn: (orderNumber: string) => cancelOrder(orderNumber),
    onSuccess: (_data, orderNumber) => {
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.detail(orderNumber) });
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.adminDetail(orderNumber) });
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.adminLists() });
    },
  });
}
