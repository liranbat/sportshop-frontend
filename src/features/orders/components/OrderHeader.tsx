import { Button } from "@/components/Button";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { RefreshButton } from "@/components/RefreshButton";
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

const PLACEHOLDER_TITLE = "Available next phase";

type Props = {
  order: OrderDetail;
  view: "user" | "admin";
  onCancelClick: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
};

export function OrderHeader({ order, view, onCancelClick, onRefresh, isRefreshing }: Props) {
  const canUserCancel = order.status === "PAID";
  const customerName = `${order.customer.firstName} ${order.customer.lastName}`.trim();

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
        {view === "admin" && (
          <p className="text-body-small text-text-secondary">
            Customer: <span className="text-body-small-bold text-text-primary">{customerName}</span>{" "}
            — {order.customer.email}
          </p>
        )}
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        <p className="text-price-card text-text-primary tabular-nums">
          {priceFormatter.format(order.totalPrice)}
        </p>
        {view === "admin" ? (
          <div className="flex items-center gap-2">
            {onRefresh && (
              <RefreshButton
                onClick={onRefresh}
                isPending={isRefreshing ?? false}
                ariaLabel="Refresh order"
              />
            )}
            <Button variant="outlined" disabled title={PLACEHOLDER_TITLE}>
              Update Status
            </Button>
            <Button variant="danger" disabled title={PLACEHOLDER_TITLE}>
              Cancel Order
            </Button>
          </div>
        ) : (
          canUserCancel && (
            <Button variant="danger" onClick={onCancelClick}>
              Cancel Order
            </Button>
          )
        )}
      </div>
    </header>
  );
}
