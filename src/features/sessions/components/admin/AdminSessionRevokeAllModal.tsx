import { ConfirmActionModal } from "@/components/ConfirmActionModal";
import { WarningTile } from "@/components/WarningTile";
import { useRevokeAllAdminSessionsMutation } from "@/features/sessions/queries";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

export function AdminSessionRevokeAllModal({ open, onOpenChange, onSuccess }: Props) {
  const mutation = useRevokeAllAdminSessionsMutation();

  const handleConfirm = () => {
    mutation.mutate(undefined, {
      onSuccess: () => {
        onOpenChange(false);
        onSuccess?.();
      },
    });
  };

  return (
    <ConfirmActionModal
      open={open}
      onOpenChange={onOpenChange}
      icon={<WarningTile />}
      title="Revoke all other sessions?"
      tone="danger"
      confirmLabel="Revoke All"
      pendingLabel="Revoking…"
      mutation={mutation}
      onConfirm={handleConfirm}
      bodyClassName="text-center"
    >
      <p className="text-body-regular text-text-primary">
        This revokes every other user&apos;s session right away — none of them will be able to
        refresh into a new access token. Your own session is not affected.
      </p>
      <p className="text-body-small text-text-secondary">
        Currently-issued access tokens stay valid until they expire (up to 15 minutes). After that,
        any protected request redirects the affected users to sign-in.
      </p>
    </ConfirmActionModal>
  );
}
