import type { ReactNode } from "react";
import { Button } from "@/components/Button";
import { MutationErrorBanner } from "@/components/Notice";
import { StandardModal } from "@/components/StandardModal";

type MutationSlice = {
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  reset: () => void;
};

type Tone = "danger" | "primary";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  tone?: Tone;
  confirmLabel: string;
  pendingLabel?: string;
  cancelLabel?: string;
  width?: string;
  mutation: MutationSlice;
  onConfirm: () => void;
  errorFooterMode?: "retry" | "close-only";
  confirmDisabled?: boolean;
  errorMessage?: string;
  bodyClassName?: string;
  children?: ReactNode;
};

export function ConfirmActionModal({
  open,
  onOpenChange,
  title,
  subtitle,
  icon,
  tone = "primary",
  confirmLabel,
  pendingLabel,
  cancelLabel = "Cancel",
  width = "32.5rem",
  mutation,
  onConfirm,
  errorFooterMode = "retry",
  confirmDisabled = false,
  errorMessage,
  bodyClassName,
  children,
}: Props) {
  const requestClose = () => {
    onOpenChange(false);
    mutation.reset();
  };

  const confirmVariant = tone === "danger" ? "danger" : "primary";
  const effectivePendingLabel = pendingLabel ?? confirmLabel;
  const showCloseOnlyFooter = mutation.isError && errorFooterMode === "close-only";

  return (
    <StandardModal
      open={open}
      onOpenChange={onOpenChange}
      width={width}
      icon={icon}
      title={title}
      subtitle={subtitle}
      errorBanner={<MutationErrorBanner mutation={mutation} overrideMessage={errorMessage} />}
      bodyClassName={bodyClassName}
      footer={
        showCloseOnlyFooter ? (
          <div className="flex justify-end">
            <Button type="button" variant="primary" onClick={requestClose}>
              Close
            </Button>
          </div>
        ) : (
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outlined"
              onClick={requestClose}
              disabled={mutation.isPending}
            >
              {cancelLabel}
            </Button>
            <Button
              type="button"
              variant={confirmVariant}
              onClick={onConfirm}
              isLoading={mutation.isPending}
              disabled={mutation.isPending || confirmDisabled}
            >
              {mutation.isPending ? effectivePendingLabel : confirmLabel}
            </Button>
          </div>
        )
      }
    >
      {children}
    </StandardModal>
  );
}
