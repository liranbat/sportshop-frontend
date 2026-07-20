import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/Button";
import { FilterDropdown, type DropdownOption } from "@/components/FilterDropdown";
import { MutationErrorBanner } from "@/components/Notice";
import { StandardModal } from "@/components/StandardModal";
import { ORDER_STATUS_LABEL } from "@/features/orders/labels";
import { orderQueryKeys, useUpdateOrderStatusMutation } from "@/features/orders/queries";
import { legalTargetStatusesFor, type OrderStatus } from "@/features/orders/schema";

type Props = {
  orderNumber: string;
  currentStatus: OrderStatus;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function UpdateOrderStatusModal({ orderNumber, currentStatus, open, onOpenChange }: Props) {
  const targets = legalTargetStatusesFor(currentStatus);
  const queryClient = useQueryClient();
  const mutation = useUpdateOrderStatusMutation(orderNumber);

  const [pick, setPick] = useState<OrderStatus | null>(null);

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      if (mutation.isError) {
        void queryClient.invalidateQueries({
          queryKey: orderQueryKeys.adminDetail(orderNumber),
        });
      }
      setPick(null);
      mutation.reset();
    }
    onOpenChange(next);
  };

  const close = () => handleOpenChange(false);

  const handleSubmit = () => {
    if (!pick) return;
    mutation.mutate(
      { priorStatus: currentStatus, targetStatus: pick },
      {
        onSuccess: () => {
          handleOpenChange(false);
        },
      },
    );
  };

  // Defensive: trigger button is gated on the same condition, but if a parent
  // ever mounts us with a terminal status, render nothing rather than an empty dropdown.
  if (targets.length === 0) return null;

  const options: DropdownOption[] = targets.map((status) => ({
    value: status,
    label: ORDER_STATUS_LABEL[status],
  }));

  return (
    <StandardModal
      open={open}
      onOpenChange={handleOpenChange}
      width="32.5rem"
      title="Update order status"
      subtitle={`Currently ${ORDER_STATUS_LABEL[currentStatus]}. Choose the next status.`}
      bodyClassName="min-h-25"
      errorBanner={<MutationErrorBanner mutation={mutation} />}
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
              Keep
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              isLoading={mutation.isPending}
              disabled={!pick || mutation.isPending}
            >
              {mutation.isPending ? "Updating…" : "Update"}
            </Button>
          </div>
        )
      }
    >
      {!mutation.isError && (
        <FilterDropdown
          options={options}
          value={pick}
          onChange={(v) => setPick(v as OrderStatus)}
          placeholder="Select a new status"
          ariaLabel="Select new order status"
          disabled={mutation.isPending}
          listboxClassName="w-fit min-w-40"
        />
      )}
    </StandardModal>
  );
}
