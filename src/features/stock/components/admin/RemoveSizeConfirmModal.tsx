import { AlertModal } from "@/components/AlertModal";
import { Button } from "@/components/Button";
import { Notice } from "@/components/Notice";
import { WarningTile } from "@/components/WarningTile";
import { useRemoveAdminStockSizeMutation } from "@/features/stock/queries";
import type { StockRow } from "@/features/stock/schema";

type Props = {
  row: StockRow;
  onClose: () => void;
  onSuccess: () => void;
};

export function RemoveSizeConfirmModal({ row, onClose, onSuccess }: Props) {
  const mutation = useRemoveAdminStockSizeMutation();

  const handleClose = () => {
    if (mutation.isPending) return;
    onClose();
  };

  const handleConfirm = () => {
    mutation.mutate(
      { productId: row.productId, size: row.size },
      {
        onSuccess: () => {
          onClose();
          onSuccess();
        },
      },
    );
  };

  return (
    <AlertModal
      open={true}
      onOpenChange={(next) => (next ? undefined : handleClose())}
      width="32.5rem"
      icon={<WarningTile />}
      title="Remove this size?"
      errorBanner={
        mutation.isError ? <Notice variant="error" message={mutation.error.message} /> : undefined
      }
      footer={
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outlined"
            onClick={handleClose}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleConfirm}
            isLoading={mutation.isPending}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Removing…" : "Remove size"}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-3 text-body-regular text-text-primary">
        <p>
          Size <strong>{row.size}</strong> will be removed from <strong>{row.productName}</strong>.
          Customers won&apos;t be able to add this size to their cart anymore.
        </p>
        <p className="text-body-small text-text-secondary">
          This is permanent. You can add the size back later, but its current quantity (
          {row.quantity}) and low-stock threshold will not be restored automatically.
        </p>
      </div>
    </AlertModal>
  );
}
