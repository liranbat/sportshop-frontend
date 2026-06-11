import type { ReactNode } from "react";

type CheckoutFooterProps = {
  // escape buttons: Back to Cart, Continue Shopping, Close
  left?: ReactNode;
  // step-nav buttons: Back
  middle?: ReactNode;
  // primary action: Next: Payment, Complete Payment, View Order, Try Again
  right?: ReactNode;
};

export function CheckoutFooter({ left, middle, right }: CheckoutFooterProps) {
  return (
    <div className="mt-auto flex items-center gap-3 pt-8">
      {left}
      <div className="flex-1" />
      {middle}
      {right}
    </div>
  );
}
