import { AlertModal } from "@/components/AlertModal";
import { Button } from "@/components/Button";
import { Notice } from "@/components/Notice";
import { useRestoreAdminProductMutation } from "@/features/catalog/queries";
import type { ProductDetail } from "@/features/catalog/schema";

type Props = {
  onClose: () => void;
  product: ProductDetail;
};

export function AdminProductRestoreModal({ onClose, product }: Props) {
  const mutation = useRestoreAdminProductMutation(product.id);

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
      title="Restore this product?"
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
            variant="primary"
            onClick={handleConfirm}
            isLoading={mutation.isPending}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Restoring…" : "Restore Product"}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-3 text-body-regular text-text-primary">
        <p>
          <strong>{product.name}</strong> will reappear in the customer-facing Catalog and become
          available for purchase again.
        </p>
        <p className="text-body-small text-text-secondary">
          Stock data, prices, and images are unchanged from before archiving.
        </p>
      </div>
    </AlertModal>
  );
}
