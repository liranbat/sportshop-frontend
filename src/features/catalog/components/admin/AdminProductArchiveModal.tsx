import { AlertModal } from "@/components/AlertModal";
import { Button } from "@/components/Button";
import { Notice } from "@/components/Notice";
import { WarningTile } from "@/components/WarningTile";
import { useArchiveAdminProductMutation } from "@/features/catalog/queries";
import type { ProductDetail } from "@/features/catalog/schema";

type Props = {
  onClose: () => void;
  product: ProductDetail;
};

export function AdminProductArchiveModal({ onClose, product }: Props) {
  const mutation = useArchiveAdminProductMutation(product.id);

  const handleClose = () => {
    if (mutation.isPending) return;
    onClose();
  };

  const handleConfirm = () => {
    mutation.mutate(
      { version: product.version },
      {
        onSuccess: () => {
          onClose();
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
      title="Archive this product?"
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
            {mutation.isPending ? "Archiving…" : "Archive Product"}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-3 text-body-regular text-text-primary">
        <p>
          <strong>{product.name}</strong> will be hidden from the customer-facing Catalog. Existing
          orders and order history continue to render correctly. Live customer carts containing this
          product will see <em>“This item is no longer available”</em> at checkout.
        </p>
        <p className="text-body-small text-text-secondary">
          Stock data and product details are preserved — you can restore this product later without
          data loss.
        </p>
      </div>
    </AlertModal>
  );
}
