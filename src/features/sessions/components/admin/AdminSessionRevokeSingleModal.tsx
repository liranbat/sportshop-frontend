import { ConfirmActionModal } from "@/components/ConfirmActionModal";
import { WarningTile } from "@/components/WarningTile";
import { useRevokeAdminSessionMutation } from "@/features/sessions/queries";
import type { Session } from "@/features/sessions/schema";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: Session | null;
  onSuccess?: () => void;
};

export function AdminSessionRevokeSingleModal({ open, onOpenChange, session, onSuccess }: Props) {
  const mutation = useRevokeAdminSessionMutation();

  if (!session) return null;

  const fullName = `${session.firstName} ${session.lastName}`.trim();

  const handleConfirm = () => {
    mutation.mutate(session.id, {
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
      icon={<WarningTile tone="amber" />}
      title="Revoke this session?"
      tone="danger"
      confirmLabel="Revoke"
      pendingLabel="Revoking…"
      mutation={mutation}
      onConfirm={handleConfirm}
      bodyClassName="text-center"
    >
      <p className="text-body-regular text-text-primary">
        This revokes {fullName}&apos;s ({session.email}) session right away — they won&apos;t be
        able to refresh into a new access token.
      </p>
      <p className="text-body-small text-text-secondary">
        Their currently-issued access token stays valid until it expires (up to 15 minutes). After
        that, their next protected request redirects them to sign-in.
      </p>
    </ConfirmActionModal>
  );
}
