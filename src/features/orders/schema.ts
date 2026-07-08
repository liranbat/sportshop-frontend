import { z } from "zod";
import { orderNumberSchema, phoneSchema } from "@/lib/schemas/common";
import { pageSchema } from "@/lib/schemas/pagination";

export const OrderStatusSchema = z.enum([
  "PAID",
  "CANCELLED_BY_USER",
  "CANCELLED_BY_ADMIN",
  "SHIPPED",
  "DELIVERED",
  "DONE",
]);

export const CustomerForOrderSchema = z.object({
  id: z.number().int().positive(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
});

export const OrderSummarySchema = z.object({
  orderNumber: orderNumberSchema,
  status: OrderStatusSchema,
  createdAt: z.string().datetime({ offset: true }),
  itemCount: z.number().int().positive(),
  totalPrice: z.number().min(0),
  customer: CustomerForOrderSchema,
});

export const OrderListPageSchema = pageSchema(OrderSummarySchema);

export const PaymentStatusSchema = z.enum(["SUCCESS", "REFUNDED"]);

export const OrderItemSchema = z.object({
  productId: z.number().int().positive(),
  productName: z.string().min(1).max(200),
  productImageUrl: z.string().max(500).nullable().optional(),
  size: z.string().min(1).max(20),
  quantity: z.number().int().positive(),
  pricePerUnit: z.number().min(0),
  lineTotal: z.number().min(0),
});

export const OrderShippingSchema = z.object({
  fullName: z.string().min(2).max(100),
  email: z.string().email().min(3).max(254),
  phone: phoneSchema,
  country: z.string().min(1).max(100),
  city: z.string().min(1).max(100),
  addressLine: z.string().min(1).max(200),
});

export const OrderPaymentSchema = z.object({
  provider: z.string().min(1).max(32),
  transactionId: z.string().min(1).max(100),
  amount: z.number().min(0),
  currency: z
    .string()
    .min(3)
    .max(3)
    .regex(/^[A-Z]{3}$/),
  status: PaymentStatusSchema,
  processedAt: z.string().datetime({ offset: true }),
  refundedAt: z.string().datetime({ offset: true }).nullable().optional(),
});

export const OrderDetailSchema = z.object({
  orderNumber: orderNumberSchema,
  status: OrderStatusSchema,
  createdAt: z.string().datetime({ offset: true }),
  cancelledAt: z.string().datetime({ offset: true }).nullable().optional(),
  totalPrice: z.number().min(0),
  itemCount: z.number().int().positive(),
  items: z.array(OrderItemSchema).min(1),
  shipping: OrderShippingSchema,
  payment: OrderPaymentSchema,
  customer: CustomerForOrderSchema,
});

export const UpdateOrderStatusRequestSchema = z.object({
  targetStatus: OrderStatusSchema,
  priorStatus: OrderStatusSchema,
});

export const UpdateShippingAddressRequestSchema = z.object({
  shipping: OrderShippingSchema,
  priorStatus: OrderStatusSchema,
});

export type OrderStatus = z.infer<typeof OrderStatusSchema>;
export type CustomerForOrder = z.infer<typeof CustomerForOrderSchema>;
export type OrderSummary = z.infer<typeof OrderSummarySchema>;
export type OrderListPage = z.infer<typeof OrderListPageSchema>;
export type PaymentStatus = z.infer<typeof PaymentStatusSchema>;
export type OrderItem = z.infer<typeof OrderItemSchema>;
export type OrderShipping = z.infer<typeof OrderShippingSchema>;
export type OrderPayment = z.infer<typeof OrderPaymentSchema>;
export type OrderDetail = z.infer<typeof OrderDetailSchema>;
export type UpdateOrderStatusRequest = z.infer<typeof UpdateOrderStatusRequestSchema>;
export type UpdateShippingAddressRequest = z.infer<typeof UpdateShippingAddressRequestSchema>;

// Which statuses an admin is allowed to move an order to, keyed by the current status.
// Terminal statuses (DONE, CANCELLED_*) and self-loops aren't listed -> they return [].
const LEGAL_STATUS_TRANSITIONS: Partial<Record<OrderStatus, readonly OrderStatus[]>> = {
  PAID: ["SHIPPED", "DELIVERED", "DONE"],
  SHIPPED: ["PAID", "DELIVERED", "DONE"],
  DELIVERED: ["PAID", "SHIPPED", "DONE"],
};

export function legalTargetStatusesFor(priorStatus: OrderStatus): readonly OrderStatus[] {
  return LEGAL_STATUS_TRANSITIONS[priorStatus] ?? [];
}

const ADMIN_EDITABLE_SHIPPING_STATUSES: readonly OrderStatus[] = ["PAID", "SHIPPED", "DELIVERED"];

export function canAdminEditShipping(status: OrderStatus): boolean {
  return ADMIN_EDITABLE_SHIPPING_STATUSES.includes(status);
}
