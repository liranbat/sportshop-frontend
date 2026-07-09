import { Link } from "react-router";
import { Button } from "@/components/Button";
import { paths } from "@/lib/paths";

type Props = {
  itemCount: number;
  totalUnits: number;
  subtotal: number;
  hasBlockingIssues: boolean;
  onProceedToCheckout: () => void;
  isValidating: boolean;
};

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function OrderSummary({
  itemCount,
  totalUnits,
  subtotal,
  hasBlockingIssues,
  onProceedToCheckout,
  isValidating,
}: Props) {
  return (
    <aside
      aria-label="Order summary"
      className="flex h-fit w-full flex-col gap-4 rounded-2xl border border-border-default bg-background-card p-6 shadow-card"
    >
      <h2 className="text-heading-m text-text-primary">Order Summary</h2>

      <div className="flex items-center justify-between text-body-small text-text-secondary">
        <span>
          Subtotal ({totalUnits} {totalUnits === 1 ? "item" : "items"})
        </span>
        <span className="tabular-nums">{priceFormatter.format(subtotal)}</span>
      </div>

      <div className="h-px w-full bg-border-default" />

      <div className="flex items-center justify-between">
        <span className="text-body-regular font-semibold text-text-primary">Total</span>
        <span className="text-price-card text-text-primary tabular-nums">
          {priceFormatter.format(subtotal)}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <Button
          variant="primary"
          disabled={itemCount === 0 || hasBlockingIssues}
          isLoading={isValidating}
          onClick={onProceedToCheckout}
        >
          Proceed to Checkout
        </Button>
        {hasBlockingIssues && (
          <p className="text-center text-caption-regular text-error-red">
            Resolve cart issues to proceed
          </p>
        )}
        <Link to={paths.catalog()} className="self-stretch">
          <Button variant="outlined" className="w-full">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </aside>
  );
}
