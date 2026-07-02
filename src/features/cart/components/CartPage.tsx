import { useState } from "react";
import { Notice } from "@/components/Notice";
import { RefreshButton } from "@/components/RefreshButton";
import { CartIssuesModal } from "@/features/cart/components/CartIssuesModal";
import { CartItemsList } from "@/features/cart/components/CartItemsList";
import { EmptyCart } from "@/features/cart/components/EmptyCart";
import { OrderSummary } from "@/features/cart/components/OrderSummary";
import { cartHasBlockingIssues } from "@/features/cart/cartItemRowState";
import {
  useCartQuery,
  useSyncCartMutation,
  useValidateCartMutation,
} from "@/features/cart/queries";
import type { StockIssue, VersionMismatch } from "@/features/cart/schema";
import { CheckoutDialog } from "@/features/checkout";

type ModalState = {
  versionMismatches: readonly VersionMismatch[];
  stockIssues: readonly StockIssue[];
};

export function CartPage() {
  const cartQuery = useCartQuery();
  const syncMutation = useSyncCartMutation();
  const validateMutation = useValidateCartMutation();

  const [issuesModal, setIssuesModal] = useState<ModalState | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  if (cartQuery.isPending) {
    return (
      <div className="flex h-full items-center justify-center text-text-secondary">
        Loading cart…
      </div>
    );
  }

  if (cartQuery.isError) {
    return (
      <div className="flex h-full items-center justify-center px-4">
        <Notice variant="error" message={`Failed to load cart: ${cartQuery.error.message}`} />
      </div>
    );
  }

  const cart = cartQuery.data;
  const isEmpty = cart.itemCount === 0;
  const hasBlockingIssues = !isEmpty && cartHasBlockingIssues(cart.items);
  const totalUnits = isEmpty ? 0 : cart.items.reduce((acc, item) => acc + item.quantity, 0);
  const isBusy = syncMutation.isPending || validateMutation.isPending;

  const handleProceedToCheckout = () => {
    validateMutation.mutate(undefined, {
      onSuccess: (result) => {
        if (result.ok) {
          setCheckoutOpen(true);
          return;
        }
        setIssuesModal({
          versionMismatches: result.versionMismatches,
          stockIssues: result.stockIssues,
        });
      },
    });
  };

  return (
    <>
      {isEmpty ? (
        <main className="h-full">
          <EmptyCart />
        </main>
      ) : (
        <main className="flex h-full w-full flex-col gap-6 px-6 py-3 lg:px-10 2xl:px-14">
          <header className="flex items-center justify-between">
            <h1 className="text-body-large font-semibold text-text-primary">
              Shopping Cart ({cart.itemCount} {cart.itemCount === 1 ? "item" : "items"})
            </h1>
            <RefreshButton
              onClick={() => syncMutation.mutate()}
              isPending={syncMutation.isPending}
              disabled={validateMutation.isPending}
              ariaLabel="Refresh cart"
            />
          </header>

          <div
            aria-busy={isBusy}
            className={`grid min-h-0 grid-cols-1 gap-6 transition-opacity lg:flex-1 lg:grid-cols-[1fr_auto] lg:grid-rows-1 lg:gap-12 ${
              isBusy ? "opacity-60" : ""
            }`}
          >
            <fieldset disabled={isBusy} className="contents">
              <div className="flex min-w-0 flex-col gap-4 lg:min-h-0">
                {hasBlockingIssues && (
                  <Notice
                    variant="error"
                    message="Some items have availability issues. Please update your cart to proceed."
                  />
                )}
                {validateMutation.isError && (
                  <Notice
                    variant="error"
                    message={`Couldn't validate cart: ${validateMutation.error.message}`}
                  />
                )}
                {syncMutation.isError && (
                  <Notice
                    variant="error"
                    message={`Couldn't refresh cart: ${syncMutation.error.message}`}
                  />
                )}
                <CartItemsList items={cart.items} />
              </div>

              <div className="lg:w-104">
                <OrderSummary
                  itemCount={cart.itemCount}
                  totalUnits={totalUnits}
                  subtotal={cart.subtotal}
                  hasBlockingIssues={hasBlockingIssues}
                  onProceedToCheckout={handleProceedToCheckout}
                  isValidating={validateMutation.isPending}
                />
              </div>
            </fieldset>
          </div>
        </main>
      )}

      {issuesModal && (
        <CartIssuesModal
          open={true}
          onOpenChange={(open) => {
            if (!open) setIssuesModal(null);
          }}
          versionMismatches={issuesModal.versionMismatches}
          stockIssues={issuesModal.stockIssues}
        />
      )}

      <CheckoutDialog open={checkoutOpen} onOpenChange={setCheckoutOpen} subtotal={cart.subtotal} />
    </>
  );
}
