import { cn } from "@/lib/cn";

export type OrderStatusKind =
  | "PAID"
  | "CANCELLED_BY_USER"
  | "CANCELLED_BY_ADMIN"
  | "SHIPPED"
  | "DELIVERED"
  | "DONE";

type Props = {
  status: OrderStatusKind;
  label?: string;
  className?: string;
};

const DEFAULT_LABEL: Record<OrderStatusKind, string> = {
  PAID: "Paid",
  CANCELLED_BY_USER: "Cancelled",
  CANCELLED_BY_ADMIN: "Cancelled by admin",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  DONE: "Done",
};

const VARIANT: Record<OrderStatusKind, { bg: string; text: string }> = {
  PAID: { bg: "bg-success-bg", text: "text-success-text" },
  CANCELLED_BY_USER: { bg: "bg-quantity-control-bg", text: "text-text-secondary" },
  CANCELLED_BY_ADMIN: { bg: "bg-quantity-control-bg", text: "text-text-secondary" },
  SHIPPED: { bg: "bg-info-bg", text: "text-info-text" },
  DELIVERED: { bg: "bg-info-bg", text: "text-info-text" },
  DONE: { bg: "bg-success-bg", text: "text-success-text" },
};

export function OrderStatusBadge({ status, label, className }: Props) {
  const v = VARIANT[status];
  const text = label ?? DEFAULT_LABEL[status];
  return (
    <span
      role="status"
      aria-label={text}
      className={cn(
        "inline-flex h-6 items-center justify-center rounded-full px-2 text-body-small-bold",
        v.bg,
        v.text,
        className,
      )}
    >
      {text}
    </span>
  );
}
