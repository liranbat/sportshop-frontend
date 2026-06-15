import { AlertModal } from "@/components/AlertModal";
import { Button } from "@/components/Button";
import { Notice } from "@/components/Notice";
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

  const handleClose = () => {
    mutation.reset();
    onOpenChange(false);
  };

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
    <AlertModal
      open={open}
      onOpenChange={(next) => (next ? onOpenChange(true) : handleClose())}
      width="32.5rem"
      icon={<WarningTile tone="amber" />}
      title="Revoke this session?"
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
            {mutation.isPending ? "Revoking…" : "Revoke"}
          </Button>
        </div>
      }
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
    </AlertModal>
  );
}
