import { useQueryClient } from "@tanstack/react-query";
import { AlertModal } from "@/components/AlertModal";
import { Button } from "@/components/Button";
import { Notice } from "@/components/Notice";
import { WarningTile } from "@/components/WarningTile";
import { orderQueryKeys, useCancelOrderMutation } from "@/features/orders/queries";

type Variant = "user" | "admin";

type Props = {
  orderNumber: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant?: Variant;
};

const CANNOT_CANCEL_MESSAGE = "This order cannot be cancelled anymore.";

const SUBTITLE: Record<Variant, string> = {
  user: "Cancelling will restore stock and refund your payment. This action cannot be undone.",
  admin:
    "Cancelling will restore stock and refund the customer's payment. This action cannot be undone.",
};

export function CancelOrderModal({ orderNumber, open, onOpenChange, variant = "user" }: Props) {
  const isAdmin = variant === "admin";
  const queryClient = useQueryClient();
  const mutation = useCancelOrderMutation({ admin: isAdmin });

  // After an error the cached detail may be stale (someone else flipped the row, etc.).
  // Refetch the right scope on dismiss so the viewer sees the actual current state.
  const detailKey = isAdmin
    ? orderQueryKeys.adminDetail(orderNumber)
    : orderQueryKeys.detail(orderNumber);
  const handleOpenChange = (next: boolean) => {
    if (!next) {
      if (mutation.isError) {
        void queryClient.invalidateQueries({ queryKey: detailKey });
      }
      mutation.reset();
    }
    onOpenChange(next);
  };

  const handleConfirm = () => {
    mutation.mutate(orderNumber, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  const close = () => handleOpenChange(false);

  return (
    <AlertModal
      open={open}
      onOpenChange={handleOpenChange}
      width="32rem"
      icon={<WarningTile />}
      title="Cancel this order?"
      subtitle={SUBTITLE[variant]}
      errorBanner={
        mutation.isError ? <Notice variant="error" message={CANNOT_CANCEL_MESSAGE} /> : undefined
      }
      footer={
        mutation.isError ? (
          <div className="flex justify-end">
            <Button type="button" variant="primary" onClick={close}>
              Close
            </Button>
          </div>
        ) : (
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outlined" onClick={close} disabled={mutation.isPending}>
              Keep Order
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={handleConfirm}
              isLoading={mutation.isPending}
            >
              {mutation.isPending ? "Cancelling…" : "Cancel Order"}
            </Button>
          </div>
        )
      }
    />
  );
}
