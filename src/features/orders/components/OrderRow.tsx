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
};

export function OrderRow({ order }: Props) {
  const navigate = useNavigate();
  const href = `/orders/${order.orderNumber}`;

  const handleClick = () => {
    void navigate(href);
  };

  const itemCountLabel = order.itemCount === 1 ? "1 item" : `${order.itemCount} items`;

  return (
    <tr
      onClick={handleClick}
      className="cursor-pointer border-t border-cart-line-divider hover:bg-primary-blue-light"
    >
      <td className="px-4 py-3 align-middle text-body-small-bold wrap-break-word text-text-primary">
        {order.orderNumber}
      </td>
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
