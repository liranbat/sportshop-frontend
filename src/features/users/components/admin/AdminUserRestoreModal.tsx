import { ConfirmActionModal } from "@/components/ConfirmActionModal";
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
      title="Restore this user?"
      confirmLabel="Restore User"
      pendingLabel="Restoring…"
      mutation={mutation}
      onConfirm={handleConfirm}
      bodyClassName="text-center"
    >
      <p className="text-body-regular text-text-primary">
        {fullName} ({user.email}) will be re-activated and able to sign in again.
      </p>
      <p className="text-body-regular text-text-primary">
        Shopping cart and sessions are not recovered — they were permanently removed at deletion
        time. The user starts fresh.
      </p>
    </ConfirmActionModal>
  );
}
