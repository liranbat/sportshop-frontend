import { Button } from "@/components/Button";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import type { OrderDetail } from "@/features/orders/schema";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

type Props = {
  order: OrderDetail;
  onCancelClick: () => void;
};

export function OrderHeader({ order, onCancelClick }: Props) {
  const canCancel = order.status === "PAID";

  return (
    <header className="flex items-start justify-between gap-4">
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-heading-l text-text-primary tabular-nums wrap-break-word">
            {order.orderNumber}
          </h1>
          <OrderStatusBadge status={order.status} />
        </div>
        <p className="text-body-small text-text-secondary">
          Placed on {dateFormatter.format(new Date(order.createdAt))}
        </p>
        {order.cancelledAt && (
          <p className="text-body-small text-text-secondary">
            Cancelled on {dateFormatter.format(new Date(order.cancelledAt))}
          </p>
        )}
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        <p className="text-price-card text-text-primary tabular-nums">
          {priceFormatter.format(order.totalPrice)}
        </p>
        {canCancel && (
          <Button variant="danger" onClick={onCancelClick}>
            Cancel Order
          </Button>
        )}
      </div>
    </header>
  );
}
