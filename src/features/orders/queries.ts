import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { listOrders } from "@/features/orders/api";
import type { OrderListParams } from "@/features/orders/filters";

export const orderQueryKeys = {
  all: ["orders"] as const,
  lists: () => [...orderQueryKeys.all, "list"] as const,
  list: (params: OrderListParams) => [...orderQueryKeys.lists(), params] as const,
};

export function useOrdersListQuery(params: OrderListParams) {
  return useQuery({
    queryKey: orderQueryKeys.list(params),
    queryFn: () => listOrders(params),
    placeholderData: keepPreviousData,
  });
}
