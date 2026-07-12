import { ConfirmActionModal } from "@/components/ConfirmActionModal";
import type { UserResponse } from "@/features/auth/schema";
import { usePromoteAdminUserMutation } from "@/features/users/queries";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserResponse;
};

export function AdminUserPromoteModal({ open, onOpenChange, user }: Props) {
  const mutation = usePromoteAdminUserMutation(user.id);
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
      title="Promote to Admin"
      confirmLabel="Promote"
      pendingLabel="Promoting…"
      mutation={mutation}
      onConfirm={handleConfirm}
      bodyClassName="text-center"
    >
      <p className="text-body-regular text-text-primary">
        Are you sure you want to grant admin privileges to {fullName}?
      </p>
      <p className="text-body-regular text-text-primary">
        This user will be able to manage users, orders, and products.
      </p>
    </ConfirmActionModal>
  );
}
