import { AlertModal } from "@/components/AlertModal";
import { Button } from "@/components/Button";
import { Notice } from "@/components/Notice";
import { useRestoreAdminCategoryMutation } from "@/features/categories/queries";
import type { Category } from "@/features/categories/schema";

type Props = {
  onClose: () => void;
  category: Category;
};

export function AdminCategoryRestoreModal({ onClose, category }: Props) {
  const mutation = useRestoreAdminCategoryMutation(category.id);

  const handleClose = () => {
    if (mutation.isPending) return;
    onClose();
  };

  const handleConfirm = () => {
    mutation.mutate(undefined, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <AlertModal
      open={true}
      onOpenChange={(next) => (next ? undefined : handleClose())}
      width="32.5rem"
      title="Restore this category?"
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
          >
            {mutation.isPending ? "Restoring…" : "Restore"}
          </Button>
        </div>
      }
    >
      <p className="text-body-regular text-text-primary">
        <strong>{category.name}</strong> will be visible again on the user-facing site as an empty
        category. Products that were reassigned when it was deleted are not automatically returned.
      </p>
    </AlertModal>
  );
}
