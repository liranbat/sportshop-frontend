import { api } from "@/lib/api";
import type { OrderListParams } from "@/features/orders/filters";
import {
  OrderDetailSchema,
  OrderListPageSchema,
  type OrderDetail,
  type OrderListPage,
} from "@/features/orders/schema";

export async function listOrders(params: OrderListParams): Promise<OrderListPage> {
  const { data } = await api.get<unknown>("/api/orders", { params });
  return OrderListPageSchema.parse(data);
}

export async function listAdminOrders(params: OrderListParams): Promise<OrderListPage> {
  const { data } = await api.get<unknown>("/api/admin/orders", { params });
  return OrderListPageSchema.parse(data);
}

export async function getOrderByNumber(orderNumber: string): Promise<OrderDetail> {
  const { data } = await api.get<unknown>(`/api/orders/${orderNumber}`);
  return OrderDetailSchema.parse(data);
}

export async function getAdminOrderByNumber(orderNumber: string): Promise<OrderDetail> {
  const { data } = await api.get<unknown>(`/api/admin/orders/${orderNumber}`);
  return OrderDetailSchema.parse(data);
}

export async function cancelOrder(orderNumber: string): Promise<void> {
  await api.post(`/api/orders/${orderNumber}/cancel`);
}

export async function cancelAdminOrder(orderNumber: string): Promise<void> {
  await api.post(`/api/admin/orders/${orderNumber}/cancel`);
}
