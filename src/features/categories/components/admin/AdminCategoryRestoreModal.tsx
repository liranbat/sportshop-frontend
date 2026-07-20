import { ConfirmActionModal } from "@/components/ConfirmActionModal";
import { useRestoreAdminCategoryMutation } from "@/features/categories/queries";
import type { Category } from "@/features/categories/schema";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
};

export function AdminCategoryRestoreModal({ open, onOpenChange, category }: Props) {
  if (!category) return null;
  return (
    <AdminCategoryRestoreModalContent
      key={category.id}
      open={open}
      onOpenChange={onOpenChange}
      category={category}
    />
  );
}

function AdminCategoryRestoreModalContent({
  open,
  onOpenChange,
  category,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category;
}) {
  const mutation = useRestoreAdminCategoryMutation(category.id);

  const handleConfirm = () => {
    mutation.mutate(undefined, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <ConfirmActionModal
      open={open}
      onOpenChange={onOpenChange}
      title="Restore this category?"
      confirmLabel="Restore"
      pendingLabel="Restoring…"
      mutation={mutation}
      onConfirm={handleConfirm}
    >
      <p className="text-body-regular text-text-primary">
        <strong>{category.name}</strong> will be visible again on the user-facing site as an empty
        category. Products that were reassigned when it was deleted are not automatically returned.
      </p>
    </ConfirmActionModal>
  );
}
