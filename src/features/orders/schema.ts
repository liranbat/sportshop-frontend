import { z } from "zod";

export const OrderStatusSchema = z.enum([
  "PAID",
  "CANCELLED_BY_USER",
  "CANCELLED_BY_ADMIN",
  "SHIPPED",
  "DELIVERED",
  "DONE",
]);

export const OrderSummarySchema = z.object({
  orderNumber: z
    .string()
    .min(23)
    .max(23)
    .regex(/^ORD-\d{8}-[A-Z0-9]{10}$/),
  status: OrderStatusSchema,
  createdAt: z.string().datetime({ offset: true }),
  itemCount: z.number().int().positive(),
  totalPrice: z.number().min(0),
});

export const OrderListPageSchema = z.object({
  items: z.array(OrderSummarySchema),
  page: z.number().int().nonnegative(),
  pageSize: z.number().int().positive(),
  totalElements: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});

export type OrderStatus = z.infer<typeof OrderStatusSchema>;
export type OrderSummary = z.infer<typeof OrderSummarySchema>;
export type OrderListPage = z.infer<typeof OrderListPageSchema>;
