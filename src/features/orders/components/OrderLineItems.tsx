import { LineItemRow } from "@/features/orders/components/LineItemRow";
import type { OrderItem } from "@/features/orders/schema";

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

type Props = {
  items: readonly OrderItem[];
  total: number;
};

export function OrderLineItems({ items, total }: Props) {
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-2xl border border-border-default bg-background-card shadow-card">
      <header className="border-b border-border-default">
        <div className="flex items-center justify-between px-4 py-3">
          <h2 className="text-heading-m text-text-primary">Items ({items.length})</h2>
        </div>
        <div className="grid grid-cols-[1fr_10rem_7rem] items-center gap-4 bg-background-page px-4 py-2 text-caption-regular font-semibold tracking-wider text-text-secondary uppercase">
          <span>Product</span>
          <span>Size &amp; Qty</span>
          <span className="text-right">Line Total</span>
        </div>
      </header>

      <ul className="min-h-0 flex-1 divide-y divide-cart-line-divider overflow-y-auto">
        {items.map((item) => (
          <li key={`${item.productId}-${item.size}`}>
            <LineItemRow item={item} />
          </li>
        ))}
      </ul>

      <footer className="border-t border-border-default">
        <div className="flex items-center justify-between px-4 py-2 text-body-small text-text-secondary">
          <span>Subtotal</span>
          <span className="tabular-nums">{priceFormatter.format(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-body-regular font-semibold text-text-primary">Total</span>
          <span className="text-price-card text-text-primary tabular-nums">
            {priceFormatter.format(total)}
          </span>
        </div>
      </footer>
    </section>
  );
}
