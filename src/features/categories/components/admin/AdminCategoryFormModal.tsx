import { useState } from "react";
import { Button } from "@/components/Button";
import { InputField } from "@/components/InputField";
import { Modal } from "@/components/Modal";
import { Notice } from "@/components/Notice";
import { ImageUpload } from "@/features/images/components/ImageUpload";
import {
  useCreateAdminCategoryMutation,
  useUpdateAdminCategoryMutation,
} from "@/features/categories/queries";
import type { Category } from "@/features/categories/schema";

type Props = {
  onClose: () => void;
  category: Category | null;
  onDeleteRequest?: (category: Category) => void;
  onRestoreRequest?: (category: Category) => void;
};

const ACCEPTED_FORMATS = ["svg"] as const;

export function AdminCategoryFormModal({
  onClose,
  category,
  onDeleteRequest,
  onRestoreRequest,
}: Props) {
  const isEdit = category !== null;
  const isDeleted = category?.isDeleted ?? false;

  const [name, setName] = useState(category?.name ?? "");
  const [icon, setIcon] = useState<string | null>(category?.icon ?? null);
  const [isUploading, setIsUploading] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  const createMutation = useCreateAdminCategoryMutation();
  const updateMutation = useUpdateAdminCategoryMutation(category?.id ?? 0);
  const activeMutation = isEdit ? updateMutation : createMutation;
  const isPendingMutation = activeMutation.isPending;

  const handleClose = () => {
    if (isPendingMutation || isUploading) return;
    onClose();
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length === 0) {
      setNameError("Name is required.");
      return;
    }
    if (trimmed.length > 100) {
      setNameError("Name must be at most 100 characters.");
      return;
    }
    setNameError(null);

    activeMutation.mutate(
      { name: trimmed, icon },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  const handleDeleteClick = () => {
    if (category && onDeleteRequest) {
      onDeleteRequest(category);
    }
  };

  const handleRestoreClick = () => {
    if (category && onRestoreRequest) {
      onRestoreRequest(category);
    }
  };

  const title = !isEdit ? "New category" : "Edit category";
  const submitLabel = !isEdit ? "Create" : "Save";
  const submitDisabled = isPendingMutation || isUploading || name.trim().length === 0;

  return (
    <Modal open={true} onOpenChange={(next) => (next ? undefined : handleClose())}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-8">
        <div className="flex flex-col gap-1">
          <Modal.Title className="text-heading-l text-text-primary">{title}</Modal.Title>
          {isEdit && (
            <span className="text-caption-regular text-text-secondary">ID: {category?.id}</span>
          )}
        </div>

        {activeMutation.isError && (
          <Notice variant="error" message={activeMutation.error.message} />
        )}

        <div className="flex flex-col gap-4">
          <InputField
            label="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={100}
            error={nameError ?? undefined}
            disabled={isPendingMutation}
            autoFocus
          />

          <div className="flex flex-col gap-2">
            <span className="text-body-small-bold text-text-primary">Icon</span>
            <ImageUpload
              acceptedFormats={ACCEPTED_FORMATS}
              currentImageUrl={icon}
              resourceType="categories"
              onUploadSuccess={(newUrl) => setIcon(newUrl)}
              onUploadingStateChange={setIsUploading}
              disabled={isPendingMutation}
            />
          </div>
        </div>

        {isEdit && category?.updatedAt && (
          <div className="text-caption-regular text-text-secondary">
            Last edited: {formatTimestamp(category.updatedAt)}
          </div>
        )}

        <div className="flex justify-between gap-3">
          <Button
            type="button"
            variant="outlined"
            onClick={handleClose}
            disabled={isPendingMutation}
          >
            Cancel
          </Button>

          <div className="flex gap-3">
            {isEdit && !isDeleted && (
              <Button
                type="button"
                variant="danger"
                onClick={handleDeleteClick}
                disabled={isPendingMutation || isUploading}
              >
                Delete category
              </Button>
            )}
            {isEdit && isDeleted && (
              <Button
                type="button"
                variant="outlined"
                onClick={handleRestoreClick}
                disabled={isPendingMutation || isUploading}
              >
                Restore
              </Button>
            )}
            <Button
              type="submit"
              variant="primary"
              isLoading={isPendingMutation}
              disabled={submitDisabled}
            >
              {isPendingMutation ? `${submitLabel}…` : submitLabel}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString();
}
