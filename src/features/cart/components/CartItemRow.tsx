import { Badge, type BadgeKind } from "@/components/Badge";
import { QuantityControl } from "@/components/QuantityControl";
import { cartItemRowState, type CartItemRowState } from "@/features/cart/cartItemRowState";
import { useRemoveCartItemMutation, useUpdateCartItemMutation } from "@/features/cart/queries";
import type { CartItem } from "@/features/cart/schema";
import { cn } from "@/lib/cn";

type Props = {
  item: CartItem;
};

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const ONE_SIZE = "ONE_SIZE";

type BadgeSpec = {
  kind: Extract<BadgeKind, "LOW_STOCK" | "OUT_OF_STOCK" | "DELETED">;
  label: string;
};

function badgeFor(state: CartItemRowState): BadgeSpec | null {
  switch (state) {
    case "LOW_STOCK":
      return { kind: "LOW_STOCK", label: "Low stock" };
    case "INSUFFICIENT_STOCK":
      return { kind: "OUT_OF_STOCK", label: "Insufficient stock" };
    case "OUT_OF_STOCK":
      return { kind: "OUT_OF_STOCK", label: "Out of stock" };
    case "UNAVAILABLE":
      return { kind: "DELETED", label: "Deleted" };
    default:
      return null;
  }
}

export function CartItemRow({ item }: Props) {
  const updateMutation = useUpdateCartItemMutation();
  const removeMutation = useRemoveCartItemMutation();

  const state = cartItemRowState(item);
  const isBlocking = state === "OUT_OF_STOCK" || state === "UNAVAILABLE";
  const isOneSize = item.size === ONE_SIZE;
  const badge = badgeFor(state);

  const handleQuantityChange = (next: number) => {
    if (next === item.quantity) return;
    updateMutation.mutate({ productId: item.productId, size: item.size, quantity: next });
  };

  const handleRemove = () => {
    removeMutation.mutate({ productId: item.productId, size: item.size });
  };

  const mutedClass = "opacity-60 transition-opacity";

  return (
    <div
      className={cn(
        "flex gap-4 p-4",
        state === "LOW_STOCK" && "border-l-4 border-warning-amber",
        state === "INSUFFICIENT_STOCK" && "border-l-4 border-error-red",
      )}
    >
      <div
        aria-hidden={item.productImageUrl === null}
        className={cn(
          "flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary-blue-light text-text-placeholder",
          isBlocking && mutedClass,
        )}
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

      <div className={cn("flex min-w-0 flex-1 flex-col gap-1", isBlocking && mutedClass)}>
        <p className="truncate text-body-regular font-semibold text-text-primary">
          {item.productName}
        </p>
        {item.productCategoryName && (
          <p className="text-caption-regular text-text-secondary">{item.productCategoryName}</p>
        )}
        <p className="text-body-small text-text-secondary">
          {priceFormatter.format(item.productPrice)} ea
        </p>
        {badge && <Badge {...badge} className="mt-1 self-start" />}
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        <p
          aria-hidden={isOneSize}
          className={cn(
            "text-body-small text-text-secondary",
            isOneSize && "invisible",
            isBlocking && mutedClass,
          )}
        >
          Size: {item.size}
        </p>
        <div className={cn("flex items-center gap-3", isBlocking && mutedClass)}>
          <QuantityControl
            value={item.quantity}
            onChange={handleQuantityChange}
            min={1}
            disabled={isBlocking}
            ariaLabel={`Quantity for ${item.productName}`}
          />
          <span
            className={cn(
              "min-w-20 text-right text-body-small-bold tabular-nums",
              isBlocking ? "text-text-placeholder line-through" : "text-text-primary",
            )}
          >
            {priceFormatter.format(item.lineTotal)}
          </span>
        </div>
        <button
          type="button"
          onClick={handleRemove}
          disabled={removeMutation.isPending}
          className="inline-flex items-center gap-1 text-caption-regular text-error-red hover:text-error-red-disabled focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error-red disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5"
            aria-hidden="true"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
          Remove
        </button>
      </div>
    </div>
  );
}
