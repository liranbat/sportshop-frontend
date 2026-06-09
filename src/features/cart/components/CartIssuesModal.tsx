import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
import { WarningTile } from "@/components/WarningTile";
import { useSyncCartMutation } from "@/features/cart/queries";
import type { StockIssue, VersionMismatch } from "@/features/cart/schema";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  versionMismatches: readonly VersionMismatch[];
  stockIssues: readonly StockIssue[];
};

function describeStockIssue(issue: StockIssue): string {
  if (issue.kind === "OUT_OF_STOCK") {
    return `${issue.productName} -- Out of stock`;
  }
  return `${issue.productName} -- Only ${issue.availableStock} available`;
}

function describeVersionMismatch(mismatch: VersionMismatch): string {
  if (mismatch.productIsArchived) {
    return `${mismatch.productName} -- no longer available`;
  }
  return mismatch.productName;
}

export function CartIssuesModal({ open, onOpenChange, versionMismatches, stockIssues }: Props) {
  const syncMutation = useSyncCartMutation();

  const handleUpdateCart = () => {
    syncMutation.mutate(undefined, {
      onSuccess: () => onOpenChange(false),
    });
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  const hasVersionMismatches = versionMismatches.length > 0;
  const hasStockIssues = stockIssues.length > 0;

  return (
    <Modal open={open} onOpenChange={onOpenChange} width="32.5rem" ariaLabel="Cart issues">
      <div className="flex max-h-[80vh] flex-col">
        <div className="flex flex-col items-center gap-4 px-8 pt-8 pb-2 text-center">
          <WarningTile tone="amber" />
          <Modal.Title className="text-heading-m text-text-primary">
            Your cart needs attention
          </Modal.Title>
          <Modal.Description className="text-body-regular text-text-secondary">
            We found issues that need to be resolved before you can proceed to checkout.
          </Modal.Description>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-8 py-4">
          {hasVersionMismatches && (
            <section className="flex flex-col gap-2">
              <h3 className="text-body-small-bold text-text-primary">Products updated</h3>
              <ul className="flex flex-col gap-2 rounded-lg bg-background-page p-4">
                {versionMismatches.map((mismatch) => (
                  <li
                    key={`${mismatch.productId}-${mismatch.size}`}
                    className="text-body-small text-text-primary"
                  >
                    {"\u2022 "}
                    {describeVersionMismatch(mismatch)}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {hasStockIssues && (
            <section className="flex flex-col gap-2">
              <h3 className="text-body-small-bold text-text-primary">Stock issues</h3>
              <ul className="flex flex-col gap-2 rounded-lg bg-background-page p-4">
                {stockIssues.map((issue) => {
                  const isOutOfStock = issue.kind === "OUT_OF_STOCK";
                  return (
                    <li
                      key={`${issue.productId}-${issue.size}`}
                      className={
                        isOutOfStock
                          ? "text-body-small text-error-red"
                          : "text-body-small text-warning-amber"
                      }
                    >
                      {"\u2022 "}
                      {describeStockIssue(issue)}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </div>

        <div className="flex justify-end gap-3 px-8 pt-2 pb-8">
          <Button variant="outlined" onClick={handleClose} disabled={syncMutation.isPending}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateCart} isLoading={syncMutation.isPending}>
            Update Cart
          </Button>
        </div>
      </div>
    </Modal>
  );
}
