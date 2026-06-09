import { CartItemRow } from "@/features/cart/components/CartItemRow";
import type { CartItem } from "@/features/cart/schema";

type Props = {
  items: readonly CartItem[];
};

export function CartItemsList({ items }: Props) {
  return (
    <ul className="flex flex-col rounded-2xl border border-border-default bg-background-card shadow-card lg:min-h-0 lg:overflow-y-auto">
      {items.map((item, index) => (
        <li
          key={`${item.productId}-${item.size}`}
          className={index === 0 ? "" : "border-t border-cart-line-divider"}
        >
          <CartItemRow item={item} />
        </li>
      ))}
    </ul>
  );
}
