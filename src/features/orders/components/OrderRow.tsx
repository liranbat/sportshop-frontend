import { useNavigate } from "react-router";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import type { OrderSummary } from "@/features/orders/schema";

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
  order: OrderSummary;
  view: "user" | "admin";
};

export function OrderRow({ order, view }: Props) {
  const navigate = useNavigate();

  const handleClick = () => {
    void navigate(`/orders/${order.orderNumber}`);
  };

  const itemCountLabel = order.itemCount === 1 ? "1 item" : `${order.itemCount} items`;
  const customerName = `${order.customer.firstName} ${order.customer.lastName}`.trim();

  return (
    <tr
      onClick={handleClick}
      className="cursor-pointer border-t border-cart-line-divider hover:bg-primary-blue-light"
    >
      <td className="px-4 py-3 align-middle text-body-small-bold wrap-break-word text-text-primary">
        {order.orderNumber}
      </td>
      {view === "admin" && (
        <td className="px-4 py-3 align-middle">
          <div className="flex flex-col">
            <span className="text-body-small-bold text-text-primary">{customerName}</span>
            <span className="text-caption-regular text-text-secondary">{order.customer.email}</span>
          </div>
        </td>
      )}
      <td className="px-4 py-3 align-middle text-caption-regular text-text-secondary">
        {dateFormatter.format(new Date(order.createdAt))}
      </td>
      <td className="px-4 py-3 align-middle text-body-small text-text-secondary">
        {itemCountLabel}
      </td>
      <td className="px-4 py-3 align-middle text-body-small-bold text-text-primary">
        {priceFormatter.format(order.totalPrice)}
      </td>
      <td className="px-4 py-3 align-middle">
        <OrderStatusBadge status={order.status} />
      </td>
    </tr>
  );
}
