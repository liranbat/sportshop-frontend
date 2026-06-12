import type { OrderItem } from "@/features/orders/schema";

const ONE_SIZE = "ONE_SIZE";

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

type Props = {
  item: OrderItem;
};

export function LineItemRow({ item }: Props) {
  const showSize = item.size !== ONE_SIZE;

  return (
    <div className="grid grid-cols-[1fr_10rem_7rem] items-center gap-4 px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <div
          aria-hidden={!item.productImageUrl}
          className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary-blue-light text-text-placeholder"
        >
          {item.productImageUrl ? (
            <img
              src={item.productImageUrl}
              alt={item.productName}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-caption-regular">IMG</span>
          )}
        </div>
        <p
          title={item.productName}
          className="truncate text-body-regular font-semibold text-text-primary"
        >
          {item.productName}
        </p>
      </div>

      <div className="flex flex-col gap-0.5 text-body-small text-text-secondary">
        {showSize && <span>Size: {item.size}</span>}
        <span>Qty: {item.quantity}</span>
      </div>

      <div className="flex flex-col items-end">
        <p className="text-body-small-bold text-text-primary tabular-nums">
          {priceFormatter.format(item.lineTotal)}
        </p>
        <p className="text-caption-regular text-text-secondary tabular-nums">
          {priceFormatter.format(item.pricePerUnit)} ea
        </p>
      </div>
    </div>
  );
}
