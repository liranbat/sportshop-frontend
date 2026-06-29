import { api } from "@/lib/api";
import type { OrderListParams } from "@/features/orders/filters";
import {
  OrderDetailSchema,
  OrderListPageSchema,
  type OrderDetail,
  type OrderListPage,
  type UpdateOrderStatusRequest,
  type UpdateShippingAddressRequest,
} from "@/features/orders/schema";

export async function listOrders(params: OrderListParams): Promise<OrderListPage> {
  const { data } = await api.get<unknown>("/orders", { params });
  return OrderListPageSchema.parse(data);
}

export async function listAdminOrders(params: OrderListParams): Promise<OrderListPage> {
  const { data } = await api.get<unknown>("/admin/orders", { params });
  return OrderListPageSchema.parse(data);
}

export async function getOrderByNumber(orderNumber: string): Promise<OrderDetail> {
  const { data } = await api.get<unknown>(`/orders/${orderNumber}`);
  return OrderDetailSchema.parse(data);
}

export async function getAdminOrderByNumber(orderNumber: string): Promise<OrderDetail> {
  const { data } = await api.get<unknown>(`/admin/orders/${orderNumber}`);
  return OrderDetailSchema.parse(data);
}

export async function cancelOrder(orderNumber: string): Promise<void> {
  await api.post(`/orders/${orderNumber}/cancel`);
}

export async function cancelAdminOrder(orderNumber: string): Promise<void> {
  await api.post(`/admin/orders/${orderNumber}/cancel`);
}

export async function updateAdminOrderStatus(
  orderNumber: string,
  body: UpdateOrderStatusRequest,
): Promise<void> {
  await api.post(`/admin/orders/${orderNumber}/update-status`, body);
}

export async function updateAdminOrderShipping(
  orderNumber: string,
  body: UpdateShippingAddressRequest,
): Promise<void> {
  await api.post(`/admin/orders/${orderNumber}/update-shipping`, body);
}
