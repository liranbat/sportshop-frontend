import { ConfirmActionModal } from "@/components/ConfirmActionModal";
import { useRestoreAdminProductMutation } from "@/features/catalog/queries";
import type { ProductDetail } from "@/features/catalog/schema";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductDetail;
};

export function AdminProductRestoreModal({ open, onOpenChange, product }: Props) {
  const mutation = useRestoreAdminProductMutation(product.id);

  const handleConfirm = () => {
    mutation.mutate(
      { version: product.version },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <ConfirmActionModal
      open={open}
      onOpenChange={onOpenChange}
      title="Restore this product?"
      confirmLabel="Restore Product"
      pendingLabel="Restoring…"
      mutation={mutation}
      onConfirm={handleConfirm}
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
    </ConfirmActionModal>
  );
}
