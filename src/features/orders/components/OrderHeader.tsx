import { Link } from "react-router";
import { Button } from "@/components/Button";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { RefreshButton } from "@/components/RefreshButton";
import { legalTargetStatusesFor, type OrderDetail } from "@/features/orders/schema";

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
  view: "user" | "admin";
  onCancelClick: () => void;
  onUpdateStatusClick: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
};

export function OrderHeader({
  order,
  view,
  onCancelClick,
  onUpdateStatusClick,
  onRefresh,
  isRefreshing,
}: Props) {
  const canUserCancel = order.status === "PAID";
  const canAdminCancel =
    order.status === "PAID" || order.status === "SHIPPED" || order.status === "DELIVERED";
  const canAdminUpdateStatus = legalTargetStatusesFor(order.status).length > 0;
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
            Customer:{" "}
            <Link
              to={`/profile/${order.customer.id}`}
              className="text-body-small-bold text-primary-blue hover:underline focus-visible:underline focus-visible:outline-none"
            >
              {customerName}
            </Link>{" "}
            — {order.customer.email}
          </p>
        )}
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        <p className="text-price-card text-text-primary tabular-nums">
          {priceFormatter.format(order.totalPrice)}
        </p>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <RefreshButton
              onClick={onRefresh}
              isPending={isRefreshing ?? false}
              ariaLabel="Refresh order"
            />
          )}
          {view === "admin" && canAdminUpdateStatus && (
            <Button variant="outlined" onClick={onUpdateStatusClick}>
              Update Status
            </Button>
          )}
          {view === "admin" && canAdminCancel && (
            <Button variant="danger" onClick={onCancelClick}>
              Cancel Order
            </Button>
          )}
          {view === "user" && canUserCancel && (
            <Button variant="danger" onClick={onCancelClick}>
              Cancel Order
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
