import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cancelOrder, getOrderByNumber, listOrders } from "@/features/orders/api";
import type { OrderListParams } from "@/features/orders/filters";
import type { OrderDetail } from "@/features/orders/schema";
import { ApiError } from "@/lib/api";

export const orderQueryKeys = {
  all: ["orders"] as const,
  lists: () => [...orderQueryKeys.all, "list"] as const,
  list: (params: OrderListParams) => [...orderQueryKeys.lists(), params] as const,
  details: () => [...orderQueryKeys.all, "detail"] as const,
  detail: (orderNumber: string) => [...orderQueryKeys.details(), orderNumber] as const,
};

export function useOrdersListQuery(params: OrderListParams) {
  return useQuery({
    queryKey: orderQueryKeys.list(params),
    queryFn: () => listOrders(params),
    placeholderData: keepPreviousData,
  });
}

export function useOrderDetailQuery(orderNumber: string) {
  return useQuery<OrderDetail, ApiError>({
    queryKey: orderQueryKeys.detail(orderNumber),
    queryFn: () => getOrderByNumber(orderNumber),
  });
}

// Backend returns 204; success invalidates the detail (forces refetch -> new state) and
// the lists (badge moves from PAID -> CANCELLED_BY_USER on the History page).
export function useCancelOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, string>({
    mutationFn: (orderNumber: string) => cancelOrder(orderNumber),
    onSuccess: (_data, orderNumber) => {
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.detail(orderNumber) });
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.lists() });
    },
  });
}
