import { api } from "@/lib/api";
import type { OrderListParams } from "@/features/orders/filters";
import { OrderListPageSchema, type OrderListPage } from "@/features/orders/schema";

export async function listOrders(params: OrderListParams): Promise<OrderListPage> {
  const { data } = await api.get<unknown>("/api/orders", { params });
  return OrderListPageSchema.parse(data);
}
