import { ConfirmActionModal } from "@/components/ConfirmActionModal";
import { WarningTile } from "@/components/WarningTile";
import { useRemoveAdminStockSizeMutation } from "@/features/stock/queries";
import type { StockRow } from "@/features/stock/schema";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  row: StockRow | null;
  onSuccess: () => void;
};

export function RemoveSizeConfirmModal({ open, onOpenChange, row, onSuccess }: Props) {
  if (!row) return null;
  return (
    <RemoveSizeConfirmModalContent
      key={`${row.productId}:${row.size}`}
      open={open}
      onOpenChange={onOpenChange}
      row={row}
      onSuccess={onSuccess}
    />
  );
}

function RemoveSizeConfirmModalContent({
  open,
  onOpenChange,
  row,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  row: StockRow;
  onSuccess: () => void;
}) {
  const mutation = useRemoveAdminStockSizeMutation();

  const handleConfirm = () => {
    mutation.mutate(
      { productId: row.productId, size: row.size },
      {
        onSuccess: () => {
          onOpenChange(false);
          onSuccess();
        },
      },
    );
  };

  return (
    <ConfirmActionModal
      open={open}
      onOpenChange={onOpenChange}
      icon={<WarningTile />}
      title="Remove this size?"
      tone="danger"
      confirmLabel="Remove size"
      pendingLabel="Removing…"
      mutation={mutation}
      onConfirm={handleConfirm}
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
    </ConfirmActionModal>
  );
}
