import { AlertModal } from "@/components/AlertModal";
import { Button } from "@/components/Button";
import { Notice } from "@/components/Notice";
import type { UserResponse } from "@/features/auth/schema";
import { useRestoreAdminUserMutation } from "@/features/users/queries";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserResponse;
};

export function AdminUserRestoreModal({ open, onOpenChange, user }: Props) {
  const mutation = useRestoreAdminUserMutation(user.id);
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
      title="Restore this user?"
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
          <Button type="button" onClick={handleConfirm} isLoading={mutation.isPending}>
            {mutation.isPending ? "Restoring…" : "Restore User"}
          </Button>
        </div>
      }
      bodyClassName="text-center"
    >
      <p className="text-body-regular text-text-primary">
        {fullName} ({user.email}) will be re-activated and able to sign in again.
      </p>
      <p className="text-body-regular text-text-primary">
        Shopping cart and sessions are not recovered — they were permanently removed at deletion
        time. The user starts fresh.
      </p>
    </AlertModal>
  );
}
