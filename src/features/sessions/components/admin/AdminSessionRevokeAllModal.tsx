import { AlertModal } from "@/components/AlertModal";
import { Button } from "@/components/Button";
import { Notice } from "@/components/Notice";
import { WarningTile } from "@/components/WarningTile";
import { useRevokeAllAdminSessionsMutation } from "@/features/sessions/queries";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

export function AdminSessionRevokeAllModal({ open, onOpenChange, onSuccess }: Props) {
  const mutation = useRevokeAllAdminSessionsMutation();

  const handleClose = () => {
    mutation.reset();
    onOpenChange(false);
  };

  const handleConfirm = () => {
    mutation.mutate(undefined, {
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
      icon={<WarningTile />}
      title="Revoke all other sessions?"
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
            {mutation.isPending ? "Revoking…" : "Revoke All"}
          </Button>
        </div>
      }
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
    </AlertModal>
  );
}
