import { AlertModal } from "@/components/AlertModal";
import { Button } from "@/components/Button";
import { Notice } from "@/components/Notice";
import { WarningTile } from "@/components/WarningTile";
import type { UserResponse } from "@/features/auth/schema";
import { useSoftDeleteAdminUserMutation } from "@/features/users/queries";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserResponse;
};

export function AdminUserSoftDeleteModal({ open, onOpenChange, user }: Props) {
  const mutation = useSoftDeleteAdminUserMutation(user.id);
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
      icon={<WarningTile />}
      title="Delete this user?"
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
            {mutation.isPending ? "Deleting…" : "Delete User"}
          </Button>
        </div>
      }
      bodyClassName="text-center"
    >
      <p className="text-body-regular text-text-primary">
        {fullName} ({user.email}) will be soft-deleted. Their shopping cart and all active sessions
        will be permanently removed and cannot be recovered. The user will no longer be able to sign
        in.
      </p>
      <p className="text-body-regular text-text-primary">
        Orders and payment history are preserved.
      </p>
    </AlertModal>
  );
}
