import type { OrderStatus } from "@/features/orders/schema";

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PAID: "Paid",
  CANCELLED_BY_USER: "Cancelled",
  CANCELLED_BY_ADMIN: "Cancelled by admin",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  DONE: "Done",
};
