import { ConfirmActionModal } from "@/components/ConfirmActionModal";
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
      title="Demote from Admin"
      tone="danger"
      confirmLabel="Demote"
      pendingLabel="Demoting…"
      mutation={mutation}
      onConfirm={handleConfirm}
      bodyClassName="text-center"
    >
      <p className="text-body-regular text-text-primary">
        Are you sure you want to remove admin privileges from {fullName}?
      </p>
      <p className="text-body-regular text-text-primary">
        This user will no longer be able to access admin features.
      </p>
    </ConfirmActionModal>
  );
}
