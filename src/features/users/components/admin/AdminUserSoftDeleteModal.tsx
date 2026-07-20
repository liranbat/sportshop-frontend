import { ConfirmActionModal } from "@/components/ConfirmActionModal";
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
      icon={<WarningTile />}
      title="Delete this user?"
      tone="danger"
      confirmLabel="Delete User"
      pendingLabel="Deleting…"
      mutation={mutation}
      onConfirm={handleConfirm}
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
    </ConfirmActionModal>
  );
}
