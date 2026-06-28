import { useState } from "react";
import { AlertModal } from "@/components/AlertModal";
import { Button } from "@/components/Button";
import { FilterDropdown, type DropdownOption } from "@/components/FilterDropdown";
import { Notice } from "@/components/Notice";
import { WarningTile } from "@/components/WarningTile";
import { useSoftDeleteAdminCategoryMutation } from "@/features/categories/queries";
import type { Category } from "@/features/categories/schema";

type Props = {
  onClose: () => void;
  category: Category;
  allCategories: readonly Category[];
};

export function AdminCategoryDeleteModal({ onClose, category, allCategories }: Props) {
  const [replacementId, setReplacementId] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const mutation = useSoftDeleteAdminCategoryMutation(category.id);

  const replacementOptions: DropdownOption[] = allCategories
    .filter((c) => !c.isDeleted && c.id !== category.id)
    .map((c) => ({ value: String(c.id), label: c.name }));

  const handleClose = () => {
    if (mutation.isPending) return;
    onClose();
  };

  const handleConfirm = () => {
    if (replacementId === null) {
      setValidationError("Pick a replacement category.");
      return;
    }
    setValidationError(null);
    mutation.mutate(
      { replacementCategoryId: Number(replacementId) },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  const noReplacementAvailable = replacementOptions.length === 0;

  return (
    <AlertModal
      open={true}
      onOpenChange={(next) => (next ? undefined : handleClose())}
      width="32.5rem"
      icon={<WarningTile />}
      title="Delete this category?"
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
            disabled={mutation.isPending || noReplacementAvailable}
          >
            {mutation.isPending ? "Deleting…" : "Delete category"}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <p className="text-body-regular text-text-primary">
          <strong>{category.name}</strong> will be soft-deleted. All of its products (active and
          archived) will be reassigned to the replacement category you pick below.
        </p>
        <p className="text-body-small text-text-secondary">
          Restoring this category later brings it back as an empty bucket — products are not
          un-reassigned.
        </p>

        {noReplacementAvailable ? (
          <Notice
            variant="warning"
            message="No active categories available to receive products. Create another active category first."
          />
        ) : (
          <div className="flex flex-col gap-1">
            <span className="text-body-small-bold text-text-primary">Replacement category</span>
            <FilterDropdown
              options={replacementOptions}
              value={replacementId}
              onChange={(value) => {
                setReplacementId(value);
                setValidationError(null);
              }}
              placeholder="Pick a category…"
              ariaLabel="Replacement category"
              disabled={mutation.isPending}
            />
            {validationError && (
              <p role="alert" className="text-caption-regular text-error-red">
                {validationError}
              </p>
            )}
          </div>
        )}
      </div>
    </AlertModal>
  );
}
