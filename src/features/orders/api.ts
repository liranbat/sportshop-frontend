import type { OrderListParams } from "@/features/orders/filters";
import {
  OrderDetailSchema,
  OrderListPageSchema,
  type OrderDetail,
  type OrderListPage,
  type UpdateOrderStatusRequest,
  type UpdateShippingAddressRequest,
} from "@/features/orders/schema";
import { getParsed, postVoid } from "@/lib/api-client";

export type OrderScope = "user" | "admin";

function orderPath(scope: OrderScope, suffix: string = ""): string {
  const base = scope === "admin" ? "/admin/orders" : "/orders";
  return suffix === "" ? base : `${base}${suffix}`;
}

export function listOrders(scope: OrderScope, params: OrderListParams): Promise<OrderListPage> {
  return getParsed(orderPath(scope), OrderListPageSchema, { params });
}

export function getOrderByNumber(scope: OrderScope, orderNumber: string): Promise<OrderDetail> {
  return getParsed(orderPath(scope, `/${orderNumber}`), OrderDetailSchema);
}

export function cancelOrder(scope: OrderScope, orderNumber: string): Promise<void> {
  return postVoid(orderPath(scope, `/${orderNumber}/cancel`));
}

export function updateAdminOrderStatus(
  orderNumber: string,
  body: UpdateOrderStatusRequest,
): Promise<void> {
  return postVoid(`/admin/orders/${orderNumber}/update-status`, body);
}

export function updateAdminOrderShipping(
  orderNumber: string,
  body: UpdateShippingAddressRequest,
): Promise<void> {
  return postVoid(`/admin/orders/${orderNumber}/update-shipping`, body);
}
