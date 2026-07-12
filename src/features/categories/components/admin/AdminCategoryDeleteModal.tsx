import { useState } from "react";
import { ConfirmActionModal } from "@/components/ConfirmActionModal";
import { FilterDropdown, type DropdownOption } from "@/components/FilterDropdown";
import { Notice } from "@/components/Notice";
import { WarningTile } from "@/components/WarningTile";
import { useSoftDeleteAdminCategoryMutation } from "@/features/categories/queries";
import type { Category } from "@/features/categories/schema";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  allCategories: readonly Category[];
};

export function AdminCategoryDeleteModal({ open, onOpenChange, category, allCategories }: Props) {
  if (!category) return null;
  return (
    <AdminCategoryDeleteModalContent
      key={category.id}
      open={open}
      onOpenChange={onOpenChange}
      category={category}
      allCategories={allCategories}
    />
  );
}

function AdminCategoryDeleteModalContent({
  open,
  onOpenChange,
  category,
  allCategories,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category;
  allCategories: readonly Category[];
}) {
  const [replacementId, setReplacementId] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const mutation = useSoftDeleteAdminCategoryMutation(category.id);

  const replacementOptions: DropdownOption[] = allCategories
    .filter((c) => !c.isDeleted && c.id !== category.id)
    .map((c) => ({ value: String(c.id), label: c.name }));

  const noReplacementAvailable = replacementOptions.length === 0;

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
      title="Delete this category?"
      tone="danger"
      confirmLabel="Delete category"
      pendingLabel="Deleting…"
      mutation={mutation}
      onConfirm={handleConfirm}
      confirmDisabled={noReplacementAvailable}
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
    </ConfirmActionModal>
  );
}
