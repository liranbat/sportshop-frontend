import { AlertModal } from "@/components/AlertModal";
import { Button } from "@/components/Button";
import { Notice } from "@/components/Notice";
import type { UserResponse } from "@/features/auth/schema";
import { useDemoteAdminUserMutation } from "@/features/users/queries";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserResponse;
};

export function AdminUserDemoteModal({ open, onOpenChange, user }: Props) {
  const mutation = useDemoteAdminUserMutation(user.id);
  const fullName = `${user.firstName} ${user.lastName}`.trim();

  const handleClose = () => {
    mutation.reset();
    onOpenChange(false);
  };

  const handleConfirm = () => {
    mutation.mutate(undefined, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <AlertModal
      open={open}
      onOpenChange={(next) => (next ? onOpenChange(true) : handleClose())}
      width="32.5rem"
      title="Demote from Admin"
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
          >
            {mutation.isPending ? "Demoting…" : "Demote"}
          </Button>
        </div>
      }
      bodyClassName="text-center"
    >
      <p className="text-body-regular text-text-primary">
        Are you sure you want to remove admin privileges from {fullName}?
      </p>
      <p className="text-body-regular text-text-primary">
        This user will no longer be able to access admin features.
      </p>
    </AlertModal>
  );
}
