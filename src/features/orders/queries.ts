import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import {
  cancelOrder,
  getOrderByNumber,
  listOrders,
  updateAdminOrderShipping,
  updateAdminOrderStatus,
} from "@/features/orders/api";
import type { OrderListParams } from "@/features/orders/filters";
import type {
  OrderDetail,
  UpdateOrderStatusRequest,
  UpdateShippingAddressRequest,
} from "@/features/orders/schema";
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
    queryFn: () => listOrders("user", params),
    placeholderData: keepPreviousData,
    enabled,
  });
}

export function useAdminOrdersListQuery(params: OrderListParams, enabled: boolean) {
  return useQuery({
    queryKey: orderQueryKeys.adminList(params),
    queryFn: () => listOrders("admin", params),
    placeholderData: keepPreviousData,
    enabled,
  });
}

export function useOrderDetailQuery(orderNumber: string, enabled: boolean = true) {
  return useQuery<OrderDetail, ApiError>({
    queryKey: orderQueryKeys.detail(orderNumber),
    queryFn: () => getOrderByNumber("user", orderNumber),
    enabled,
  });
}

export function useAdminOrderDetailQuery(orderNumber: string, enabled: boolean) {
  return useQuery<OrderDetail, ApiError>({
    queryKey: orderQueryKeys.adminDetail(orderNumber),
    queryFn: () => getOrderByNumber("admin", orderNumber),
    enabled,
  });
}

// invalidates all four scopes -- any order write can flip the badge on either
// history page and either detail page, regardless of which path issued it.
export function invalidateAllOrderViews(queryClient: QueryClient, orderNumber: string): void {
  queryClient.invalidateQueries({ queryKey: orderQueryKeys.detail(orderNumber) });
  queryClient.invalidateQueries({ queryKey: orderQueryKeys.adminDetail(orderNumber) });
  queryClient.invalidateQueries({ queryKey: orderQueryKeys.lists() });
  queryClient.invalidateQueries({ queryKey: orderQueryKeys.adminLists() });
}

export function useCancelOrderMutation(options?: { admin?: boolean }) {
  const admin = options?.admin ?? false;
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, string>({
    mutationFn: (orderNumber: string) => cancelOrder(admin ? "admin" : "user", orderNumber),
    onSuccess: (_data, orderNumber) => invalidateAllOrderViews(queryClient, orderNumber),
  });
}

export function useUpdateOrderStatusMutation(orderNumber: string) {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, UpdateOrderStatusRequest>({
    mutationFn: (body) => updateAdminOrderStatus(orderNumber, body),
    onSuccess: () => invalidateAllOrderViews(queryClient, orderNumber),
  });
}

export function useUpdateShippingAddressMutation(orderNumber: string) {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, UpdateShippingAddressRequest>({
    mutationFn: (body) => updateAdminOrderShipping(orderNumber, body),
    onSuccess: () => invalidateAllOrderViews(queryClient, orderNumber),
  });
}
