import { ConfirmActionModal } from "@/components/ConfirmActionModal";
import { WarningTile } from "@/components/WarningTile";
import { useArchiveAdminProductMutation } from "@/features/catalog/queries";
import type { ProductDetail } from "@/features/catalog/schema";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductDetail;
};

export function AdminProductArchiveModal({ open, onOpenChange, product }: Props) {
  const mutation = useArchiveAdminProductMutation(product.id);

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
      icon={<WarningTile />}
      title="Archive this product?"
      tone="danger"
      confirmLabel="Archive Product"
      pendingLabel="Archiving…"
      mutation={mutation}
      onConfirm={handleConfirm}
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
    </ConfirmActionModal>
  );
}
