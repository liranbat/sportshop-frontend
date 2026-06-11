import { useNavigate } from "react-router";
import { Button } from "@/components/Button";
import type { CheckoutResult } from "../schema";
import { CheckoutFooter } from "./CheckoutFooter";

type SuccessStateProps = {
  result: CheckoutResult;
  onClose: () => void;
};

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function SuccessState({ result, onClose }: SuccessStateProps) {
  const navigate = useNavigate();

  const handleViewOrder = () => {
    onClose();
    // TODO: once the order details page exists, navigate to /orders/<orderNumber> instead.
    void navigate("/orders");
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success-bg">
        <CheckIcon />
      </div>

      <h3 className="mt-4 text-heading-l text-text-primary">Order confirmed</h3>

      <p className="mt-2 text-body-regular text-text-secondary">
        Thanks for your purchase! Your order is on its way.
      </p>

      <p className="mt-4 text-body-small-bold text-text-primary tabular-nums">
        Order # {result.orderNumber}
      </p>

      <div className="mt-6 flex w-full flex-col gap-3 rounded-xl border border-success-border bg-success-bg/60 p-4">
        <div className="flex items-center justify-between text-body-small text-text-secondary">
          <span>
            {result.itemCount} {result.itemCount === 1 ? "item" : "items"}
          </span>
        </div>
        <div className="h-px w-full bg-success-border" />
        <div className="flex items-center justify-between">
          <span className="text-body-regular font-semibold text-text-primary">Total</span>
          <span className="text-price-card text-primary-blue tabular-nums">
            {priceFormatter.format(result.totalPrice)}
          </span>
        </div>
      </div>

      <CheckoutFooter
        left={
          <Button variant="outlined" onClick={onClose}>
            Continue Shopping
          </Button>
        }
        right={<Button onClick={handleViewOrder}>View Order</Button>}
      />
    </div>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-6 w-6 text-success-green">
      <path
        d="M5 12l5 5L20 7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
